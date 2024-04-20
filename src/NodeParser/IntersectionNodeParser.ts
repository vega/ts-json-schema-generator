import ts from "typescript";
import { Context, NodeParser } from "../NodeParser.js";
import { SubNodeParser } from "../SubNodeParser.js";
import { BaseType } from "../Type/BaseType.js";
import { IntersectionType } from "../Type/IntersectionType.js";
import { PrimitiveType } from "../Type/PrimitiveType.js";
import { UnionType } from "../Type/UnionType.js";
import { derefType } from "../Utils/derefType.js";
import { uniqueTypeArray } from "../Utils/uniqueTypeArray.js";
import { UndefinedType } from "../Type/UndefinedType.js";
import { NeverType } from "../Type/NeverType.js";
import { notUndefined } from "../Utils/notUndefined.js";

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
        if (types.some((t) => t instanceof NeverType)) {
            return new NeverType();
        }

        return translate(types.filter(notUndefined));
    }
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

    if (types.length == 1) {
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
    } else if (result.length > 1) {
        return new UnionType(result);
    }

    throw new Error("Could not translate intersection to union.");
}
