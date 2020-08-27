import * as ts from "typescript";
import { Context } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { ReferenceType } from "../Type/ReferenceType";
import { UIComponentType } from "../Type/UIComponentType";
import { getKey } from "../Utils/nodeKey";

export class ReactFunctionComponentNodeParser implements SubNodeParser {
    public supportsNode(node: ts.InterfaceDeclaration | ts.TypeAliasDeclaration): boolean {
        return (
            (ts.isInterfaceDeclaration(node) && this.isReactFunctionComponentInterface(node)) ||
            (ts.isTypeAliasDeclaration(node) && this.isReactFCType(node))
        );
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

    private isReactFunctionComponentInterface(node: ts.InterfaceDeclaration): boolean {
        return node.name.text === "FunctionComponent" && this.isReactModule(node);
    }

    private isReactFCType(node: ts.TypeAliasDeclaration): boolean {
        return node.name.text === "FC" && this.isReactModule(node);
    }

    private isReactModule(node: ts.InterfaceDeclaration | ts.TypeAliasDeclaration): boolean {
        let parent = node.parent;
        if (ts.isModuleBlock(parent)) {
            parent = parent.parent;
        }

        return ts.isModuleDeclaration(parent) && parent.name.text === "React";
    }
}
