import * as ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { IntersectionType } from "../Type/IntersectionType";
import { UnionType } from "../Type/UnionType";
import { derefType } from "../Utils/derefType";
import { referenceHidden } from "../Utils/isHidden";

export class IntersectionNodeParser implements SubNodeParser {
    public constructor(
        private typeChecker: ts.TypeChecker,
        private childNodeParser: NodeParser,
    ) {
    }

    public supportsNode(node: ts.IntersectionTypeNode): boolean {
        return node.kind === ts.SyntaxKind.IntersectionType;
    }

    public createType(node: ts.IntersectionTypeNode, context: Context): BaseType {
        const hidden = referenceHidden(this.typeChecker);
        return this.translate(new IntersectionType(
            node.types
                .filter((subnode) => !hidden(subnode))
                .map((subnode) => this.childNodeParser.createType(subnode, context)),
        ));
    }

    /**
     * Translates the given intersection type into a union type if necessary so `A & (B | C)` becomes
     * `(A & B) | (A & C)`. If no translation is needed then the original intersection type is returned.
     *
     * @param intersection - The intersection type to translate.
     * @return Either the union type into which the intersection type was translated or the original intersection type
     *         if no translation is needed.
     */
    private translate(intersection: IntersectionType): IntersectionType | UnionType {
        const unions = intersection.getTypes().map(type => {
            const derefed = derefType(type);
            return derefed instanceof UnionType ? derefed.getTypes() : [ type ];
        });
        const result: IntersectionType[] = [];
        function process(i: number, types: BaseType[] = []) {
            for (const type of unions[i]) {
                const currentTypes = types.slice();
                currentTypes.push(type);
                if (i < unions.length - 1) {
                    process(i + 1, currentTypes);
                } else {
                    result.push(new IntersectionType(currentTypes));
                }
            }
        }
        process(0);
        return result.length > 1 ? new UnionType(result) : intersection;
    }
}
