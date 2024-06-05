import ts from "typescript";
import { ExpectationFailedError } from "../Error/Errors.js";
import type { Context, NodeParser } from "../NodeParser.js";
import type { SubNodeParser } from "../SubNodeParser.js";
import type { BaseType } from "../Type/BaseType.js";
import { IntersectionType } from "../Type/IntersectionType.js";
import { LiteralType } from "../Type/LiteralType.js";
import { NeverType } from "../Type/NeverType.js";
import { ObjectType } from "../Type/ObjectType.js";
import { PrimitiveType } from "../Type/PrimitiveType.js";
import { StringType } from "../Type/StringType.js";
import { UndefinedType } from "../Type/UndefinedType.js";
import { UnionType } from "../Type/UnionType.js";
import { isLiteralUnion } from "../TypeFormatter/LiteralUnionTypeFormatter.js";
import { derefType } from "../Utils/derefType.js";
import { uniqueTypeArray } from "../Utils/uniqueTypeArray.js";

export class IntersectionNodeParser implements SubNodeParser {
    public constructor(
        protected typeChecker: ts.TypeChecker,
        protected childNodeParser: NodeParser,
    ) {}

    public supportsNode(node: ts.IntersectionTypeNode): boolean {
        return node.kind === ts.SyntaxKind.IntersectionType;
    }

    public createType(node: ts.IntersectionTypeNode, context: Context): BaseType {
        const types = node.types.map((subnode) => this.childNodeParser.createType(subnode, context));

        // if any type is never, the intersection type resolves to never
        if (types.filter((t) => t instanceof NeverType).length) {
            return new NeverType();
        }

        // handle autocomplete hacks like `string & {}`
        if (types.length === 2 && types.some((t) => isEmptyObject(t))) {
            if (types.some((t) => t instanceof StringType)) {
                return new StringType(true);
            }
            const nonObject = types.find((t) => !isEmptyObject(t));
            if (nonObject instanceof LiteralType || (nonObject instanceof UnionType && isLiteralUnion(nonObject))) {
                return nonObject;
            }
        }

        return translate(types);
    }
}

function isEmptyObject(x: BaseType) {
    const t = derefType(x);
    return t instanceof ObjectType && !t.getAdditionalProperties() && !t.getProperties().length;
}

function derefAndFlattenUnions(type: BaseType): BaseType[] {
    const derefed = derefType(type);
    return derefed instanceof UnionType
        ? derefed.getTypes().reduce((result: BaseType[], derefedType: BaseType) => {
              result.push(...derefAndFlattenUnions(derefedType));
              return result;
          }, [])
        : [type];
}

/**
 * Translates the given intersection type into a union type if necessary so `A & (B | C)` becomes
 * `(A & B) | (A & C)`. If no translation is needed then the original intersection type is returned.
 */
export function translate(types: BaseType[]): BaseType {
    types = uniqueTypeArray(types);

    if (types.length === 1) {
        return types[0];
    }

    const unions = types.map(derefAndFlattenUnions);
    const result: BaseType[] = [];

    function process(i: number, t: BaseType[] = []) {
        for (const type of unions[i]) {
            let currentTypes = [...t, type];
            if (i < unions.length - 1) {
                process(i + 1, currentTypes);
            } else {
                currentTypes = uniqueTypeArray(currentTypes);

                if (currentTypes.some((c) => c instanceof UndefinedType)) {
                    // never
                    result.push(new UndefinedType());
                } else {
                    const primitives = currentTypes.filter((c) => c instanceof PrimitiveType);
                    if (primitives.length === 1) {
                        result.push(primitives[0]);
                    } else if (primitives.length > 1) {
                        // conflict -> ignore
                    } else if (currentTypes.length === 1) {
                        result.push(currentTypes[0]);
                    } else {
                        result.push(new IntersectionType(currentTypes));
                    }
                }
            }
        }
    }

    process(0);

    if (result.length === 1) {
        return result[0];
    }

    if (result.length > 1) {
        return new UnionType(result);
    }

    throw new ExpectationFailedError("Could not translate intersection to union.");
}
