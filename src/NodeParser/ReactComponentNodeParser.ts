import * as ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { ReferenceType } from "../Type/ReferenceType";
import { UIComponentType } from "../Type/UIComponentType";
import { getKey } from "../Utils/nodeKey";

export class ReactComponentNodeParser implements SubNodeParser {
    public constructor(private typeChecker: ts.TypeChecker, private childNodeParser: NodeParser) {}

    public supportsNode(node: ts.ClassDeclaration | ts.InterfaceDeclaration): boolean {
        return (
            (node.kind === ts.SyntaxKind.ClassDeclaration || node.kind === ts.SyntaxKind.InterfaceDeclaration) &&
            this.isReactComponentImplementation(node)
        );
    }

    public createType(
        node: ts.InterfaceDeclaration | ts.ClassDeclaration,
        context: Context,
        reference?: ReferenceType
    ): BaseType {
        const id = this.getTypeId(node, context);
        if (reference) {
            reference.setId(id);
            reference.setName(id);
        }

        const typeArgument = this.getReactComponentPropsType(node, context);
        return new UIComponentType(id, typeArgument);
    }

    private isReactComponentImplementation(node: ts.InterfaceDeclaration | ts.ClassDeclaration): boolean {
        if (this.isReactComponentNode(node)) {
            return true;
        }

        if (node.heritageClauses) {
            return node.heritageClauses.some((heritageClause) => {
                return heritageClause.types.some((type) => {
                    let typeSymbol = this.typeChecker.getSymbolAtLocation(type.expression);

                    if (typeSymbol && typeSymbol.flags & ts.SymbolFlags.Alias) {
                        typeSymbol = this.typeChecker.getAliasedSymbol(typeSymbol);
                    }

                    if (typeSymbol && typeSymbol.declarations.length > 0) {
                        const declaration = typeSymbol.declarations[0];
                        if (ts.isInterfaceDeclaration(declaration) || ts.isClassDeclaration(declaration)) {
                            return this.isReactComponentImplementation(declaration);
                        }
                    }

                    return false;
                });
            });
        }

        return false;
    }

    private getReactComponentPropsType(
        node: ts.InterfaceDeclaration | ts.ClassDeclaration,
        context: Context
    ): BaseType | undefined {
        let propsType: BaseType | undefined;
        if (this.isReactComponentNode(node)) {
            propsType = context.getArguments()[0];
        }

        if (!propsType && node.heritageClauses) {
            node.heritageClauses.find((heritageClause) => {
                heritageClause.types.find((type) => {
                    let typeSymbol = this.typeChecker.getSymbolAtLocation(type.expression);

                    if (typeSymbol && typeSymbol.flags & ts.SymbolFlags.Alias) {
                        typeSymbol = this.typeChecker.getAliasedSymbol(typeSymbol);
                    }

                    if (typeSymbol && typeSymbol.declarations.length > 0) {
                        const declaration = typeSymbol.declarations[0];

                        if (ts.isInterfaceDeclaration(declaration) || ts.isClassDeclaration(declaration)) {
                            propsType = this.getReactComponentPropsType(
                                declaration,
                                this.createSubContext(type, context)
                            );
                        }
                    }

                    return !!propsType;
                });
            });
        }

        return propsType;
    }

    private isReactComponentNode(node: ts.InterfaceDeclaration | ts.ClassDeclaration): boolean {
        const name = node.name?.text;
        return (name === "PureComponent" || name === "Component") && this.isReactModule(node);
    }

    private isReactModule(node: ts.InterfaceDeclaration | ts.ClassDeclaration): boolean {
        let parent = node.parent;
        if (ts.isModuleBlock(parent)) {
            parent = parent.parent;
        }

        return ts.isModuleDeclaration(parent) && parent.name.text === "React";
    }

    private createSubContext(node: ts.ExpressionWithTypeArguments, parentContext: Context): Context {
        const subContext = new Context(node);
        if (node.typeArguments?.length) {
            node.typeArguments.forEach((typeArg) => {
                const type = this.childNodeParser.createType(typeArg, parentContext);
                subContext.pushArgument(type);
            });
        }
        return subContext;
    }

    private getTypeId(node: ts.Node, context: Context): string {
        return `reactComponent-${getKey(node, context)}`;
    }
}
