import ts from "typescript";
import type { SubNodeParser } from "../SubNodeParser.js";
import type { BaseType } from "../Type/BaseType.js";
import { FunctionType } from "../Type/FunctionType.js";
import type { FunctionOptions } from "../Config.js";
import { NeverType } from "../Type/NeverType.js";
import { DefinitionType } from "../Type/DefinitionType.js";
import type { Context, NodeParser } from "../NodeParser.js";
import { ObjectProperty, ObjectType } from "../Type/ObjectType.js";
import { getKey } from "../Utils/nodeKey.js";

export class FunctionNodeParser implements SubNodeParser {
    constructor(
        protected childNodeParser: NodeParser,
        protected functions: FunctionOptions,
    ) {}

    public supportsNode(node: ts.Node): boolean {
        return (
            node.kind === ts.SyntaxKind.FunctionType ||
            node.kind === ts.SyntaxKind.FunctionExpression ||
            node.kind === ts.SyntaxKind.ArrowFunction ||
            node.kind === ts.SyntaxKind.FunctionDeclaration
        );
    }

    public createType(
        node: ts.FunctionTypeNode | ts.FunctionExpression | ts.FunctionDeclaration | ts.ArrowFunction,
        context: Context,
    ): BaseType {
        if (this.functions === "hide") {
            return new NeverType();
        }

        const name = getTypeName(node);
        const func = new FunctionType(node, getNamedArguments(this.childNodeParser, node, context));

        return name ? new DefinitionType(name, func) : func;
    }
}

export function getNamedArguments(
    childNodeParser: NodeParser,
    node:
        | ts.FunctionTypeNode
        | ts.FunctionExpression
        | ts.FunctionDeclaration
        | ts.ArrowFunction
        | ts.ConstructorTypeNode,
    context: Context,
) {
    if (node.parameters.length === 0) {
        return undefined;
    }

    const parameterTypes = node.parameters.map((parameter) => {
        return childNodeParser.createType(parameter, context);
    });

    return new ObjectType(
        `object-${getKey(node, context)}`,
        [],
        parameterTypes.map((parameterType, index) => {
            // If it's missing a questionToken but has an initializer we can consider the property as not required
            const required = node.parameters[index].questionToken ? false : !node.parameters[index].initializer;

            return new ObjectProperty(node.parameters[index].name.getText(), parameterType, required);
        }),
        false,
    );
}

export function getTypeName(
    node:
        | ts.FunctionTypeNode
        | ts.FunctionExpression
        | ts.FunctionDeclaration
        | ts.ArrowFunction
        | ts.ConstructorTypeNode,
): string | undefined {
    if (ts.isArrowFunction(node) || ts.isFunctionExpression(node) || ts.isFunctionTypeNode(node)) {
        const parent = node.parent;
        if (ts.isVariableDeclaration(parent)) {
            return parent.name.getText();
        }
    }
    if (ts.isFunctionDeclaration(node)) {
        return node.name?.getText();
    }
    return undefined;
}
