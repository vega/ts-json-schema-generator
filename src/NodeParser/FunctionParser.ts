import ts from "typescript";
import { NodeParser } from "../NodeParser";
import { Context } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { ObjectProperty, ObjectType } from "../Type/ObjectType";
import { getKey } from "../Utils/nodeKey";

/**
 * This function parser supports both `FunctionDeclaration` & `ArrowFunction` nodes.
 * This parser will only parse the input parameters.
 * TODO: Parse `ReturnType` of the function?
 */
export class FunctionParser implements SubNodeParser {
    constructor(private childNodeParser: NodeParser) {}

    public supportsNode(node: ts.ArrowFunction): boolean {
        return node.kind === ts.SyntaxKind.ArrowFunction || node.kind === ts.SyntaxKind.FunctionDeclaration;
    }
    public createType(node: ts.FunctionTypeNode | ts.ArrowFunction, context: Context): ObjectType | undefined {
        const parameterTypes = node.parameters.map((parameter) => {
            return this.childNodeParser.createType(parameter, context);
        });

        return new ObjectType(
            `object-${getKey(node, context)}`,
            [],
            parameterTypes.map((parameterType, index) => {
                // If it's missing a questionToken but has an initializer we can consider the property as not required
                const required = node.parameters[index].questionToken ? false : !node.parameters[index].initializer;

                return new ObjectProperty(node.parameters[index].name.getText(), parameterType, required);
            }),
            false
        );
    }
}
