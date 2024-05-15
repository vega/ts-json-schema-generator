import ts from "typescript";
import { SubNodeParser } from "../SubNodeParser.js";
import { BaseType } from "../Type/BaseType.js";
import { ConstructorType } from "../Type/ConstructorType.js";
import { FunctionOptions } from "../Config.js";
import { NeverType } from "../Type/NeverType.js";
import { Context, NodeParser } from "../NodeParser.js";
import { DefinitionType } from "../Type/DefinitionType.js";
import { getNamedArguments, getTypeName } from "./FunctionNodeParser.js";

export class ConstructorNodeParser implements SubNodeParser {
    constructor(
        protected childNodeParser: NodeParser,
        protected functions: FunctionOptions,
    ) {}

    public supportsNode(node: ts.TypeNode): boolean {
        return node.kind === ts.SyntaxKind.ConstructorType;
    }

    public createType(node: ts.ConstructorTypeNode, context: Context): BaseType {
        if (this.functions === "hide") {
            return new NeverType();
        }

        const name = getTypeName(node);
        const func = new ConstructorType(node, getNamedArguments(this.childNodeParser, node, context));

        return name ? new DefinitionType(name, func) : func;
    }
}
