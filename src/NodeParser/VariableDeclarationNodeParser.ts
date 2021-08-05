import * as ts from "typescript";
import { Context } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";

export class VariableDeclarationNodeParser implements SubNodeParser {
    public constructor(private childNodeParser: SubNodeParser) {}

    public supportsNode(node: ts.VariableDeclaration): boolean {
        return node.kind === ts.SyntaxKind.VariableDeclaration;
    }

    public createType(node: ts.VariableDeclaration, context: Context): BaseType | undefined {
        let baseType: BaseType | undefined = undefined;
        if (node.type) {
            baseType = this.childNodeParser.createType(node.type, new Context());
        } else if (node.initializer) {
            baseType = this.childNodeParser.createType(node.initializer, new Context());
        }

        return baseType;
    }
}
