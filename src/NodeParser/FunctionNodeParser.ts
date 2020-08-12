import * as ts from "typescript";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { AnyType } from "../Type/AnyType";
import { FunctionType, FunctionArgument } from "../Type/FunctionType";
import { Context, NodeParser } from "../NodeParser";
import { getKey } from "../Utils/nodeKey";

/**
 * A function node parser that creates a function type so that mapped types can
 * use functions as values.
 */
export class FunctionNodeParser implements SubNodeParser {
    public constructor(private childNodeParser: NodeParser) {}

    public supportsNode(node: ts.FunctionTypeNode | ts.MethodSignature | ts.MethodDeclaration): boolean {
        return (
            node.kind === ts.SyntaxKind.FunctionType ||
            node.kind === ts.SyntaxKind.MethodSignature ||
            node.kind === ts.SyntaxKind.MethodDeclaration
        );
    }

    public createType(
        node: ts.FunctionTypeNode | ts.MethodSignature | ts.MethodDeclaration,
        context: Context
    ): BaseType {
        return new FunctionType(
            `function-${getKey(node, context)}`,
            node.parameters.map((parameterNode) => {
                const baseType = parameterNode.type
                    ? this.childNodeParser.createType(parameterNode.type, context)
                    : new AnyType();
                return new FunctionArgument(parameterNode.name.getText(), baseType);
            }),
            this.childNodeParser.createType(node.type!, context)
        );
    }
}
