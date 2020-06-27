import * as ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { IntersectionType } from "../Type/IntersectionType";
import { PrimitiveType } from "../Type/PrimitiveType";
import { UnionType } from "../Type/UnionType";
import { derefType } from "../Utils/derefType";
import { uniqueTypeArray } from "../Utils/uniqueTypeArray";
import { UndefinedType } from "./../Type/UndefinedType";

export class IntersectionNodeParser implements SubNodeParser {
    public constructor(private typeChecker: ts.TypeChecker, private childNodeParser: NodeParser) {}

    public supportsNode(node: ts.IntersectionTypeNode): boolean {
        return node.kind === ts.SyntaxKind.IntersectionType;
    }

    public createType(node: ts.IntersectionTypeNode, context: Context): BaseType | undefined {
        const types = node.types.map((subnode) => this.childNodeParser.createType(subnode, context));

        // if any type is undefined (never), an intersection type should be undefined (never)
        if (types.filter((t) => t === undefined).length) {
            return undefined;
        }

        return translate(types as BaseType[]);
    }
}

/**
 * Translates the given intersection type into a union type if necessary so `A & (B | C)` becomes
 * `(A & B) | (A & C)`. If no translation is needed then the original intersection type is returned.
 */
export function translate(types: BaseType[]): BaseType | undefined {
    types = uniqueTypeArray(types as BaseType[]);

    if (types.length == 1) {
        return types[0];
    }

    const unions = types.map((type) => {
        const derefed = derefType(type);
        return derefed instanceof UnionType ? derefed.getTypes() : [type];
    });
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

    return undefined;
}
