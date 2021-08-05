import * as ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { AnyType } from "../Type/AnyType";

export class TypeParameterParser implements SubNodeParser {
    public constructor(private childNodeParser: NodeParser) {}

    public supportsNode(node: ts.TypeParameterDeclaration): boolean {
        return node.kind === ts.SyntaxKind.TypeParameter;
    }

    public createType(node: ts.TypeParameterDeclaration, context: Context): BaseType {
        if (node.constraint) {
            return this.childNodeParser.createType(node.constraint, context) || new AnyType();
        } else {
            return new AnyType();
        }
    }
}
