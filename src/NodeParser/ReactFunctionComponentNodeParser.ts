import * as ts from "typescript";
import { Context } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { ReferenceType } from "../Type/ReferenceType";
import { UIComponentType } from "../Type/UIComponentType";
import { getKey } from "../Utils/nodeKey";

export class ReactFunctionComponentNodeParser implements SubNodeParser {
    public supportsNode(node: ts.InterfaceDeclaration): boolean {
        return node.kind === ts.SyntaxKind.InterfaceDeclaration && this.isReactFunctionComponent(node);
    }

    public createType(node: ts.InterfaceDeclaration, context: Context, reference?: ReferenceType): BaseType {
        const id = this.getTypeId(node, context);
        if (reference) {
            reference.setId(id);
            reference.setName(id);
        }

        const propsType = context.getArguments()[0];
        return new UIComponentType(id, propsType);
    }

    private getTypeId(node: ts.Node, context: Context): string {
        return `reactFunctionComponent-${getKey(node, context)}`;
    }

    private isReactFunctionComponent(node: ts.InterfaceDeclaration): boolean {
        return node.name.text === "FunctionComponent";
    }
}
