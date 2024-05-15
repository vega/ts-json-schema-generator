import ts from "typescript";
import { Context, NodeParser } from "../NodeParser.js";
import { SubNodeParser } from "../SubNodeParser.js";
import { AnnotatedType } from "../Type/AnnotatedType.js";
import { ArrayType } from "../Type/ArrayType.js";
import { BaseType } from "../Type/BaseType.js";
import { ReferenceType } from "../Type/ReferenceType.js";
import { RestType } from "../Type/RestType.js";

export class NamedTupleMemberNodeParser implements SubNodeParser {
    public constructor(protected childNodeParser: NodeParser) {}

    public supportsNode(node: ts.TypeNode): boolean {
        return node.kind === ts.SyntaxKind.NamedTupleMember;
    }

    public createType(node: ts.NamedTupleMember, context: Context, reference?: ReferenceType): BaseType {
        const baseType = this.childNodeParser.createType(node.type, context, reference);

        if (baseType instanceof ArrayType && node.getChildAt(0).kind === ts.SyntaxKind.DotDotDotToken) {
            return new RestType(baseType, node.name.text);
        }

        return baseType && new AnnotatedType(baseType, { title: node.name.text }, false);
    }
}
