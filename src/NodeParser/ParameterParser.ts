import ts from "typescript";
import type { NodeParser } from "../NodeParser.js";
import type { Context } from "../NodeParser.js";
import type { SubNodeParser } from "../SubNodeParser.js";
import type { BaseType } from "../Type/BaseType.js";
import { UnknownType } from "../Type/UnknownType.js";

export class ParameterParser implements SubNodeParser {
    constructor(
        protected childNodeParser: NodeParser,
        protected checker: ts.TypeChecker,
    ) {}

    public supportsNode(node: ts.Node): boolean {
        return node.kind === ts.SyntaxKind.Parameter;
    }
    public createType(node: ts.ParameterDeclaration, context: Context): BaseType {
        // If the parameter type is declared, use it directly to retain the location information.
        if (node.type) {
            return this.childNodeParser.createType(node.type, context);
        }

        // otherwise, use inferred type
        const paramType = this.checker.getTypeAtLocation(node.name);
        const typeNode = this.checker.typeToTypeNode(paramType, node.parent, ts.NodeBuilderFlags.NoTruncation);
        if (typeNode) {
            return this.childNodeParser.createType(typeNode, context);
        }

        return new UnknownType(true);
    }
}
