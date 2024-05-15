import ts from "typescript";
import type { Context, NodeParser } from "../NodeParser";
import type { SubNodeParser } from "../SubNodeParser";
import type { BaseType } from "../Type/BaseType";
import { ReferenceType } from "../Type/ReferenceType";
import { DefinitionType } from "../Type/DefinitionType";
import { AliasType } from "../Type/AliasType";
import { getKey } from "../Utils/nodeKey";

/**
 * Needs to be registered before 261, 260, 230, 262 node kinds
 */
export class PromiseNodeParser implements SubNodeParser {
    public constructor(
        protected typeChecker: ts.TypeChecker,
        protected childNodeParser: NodeParser
    ) {}

    public supportsNode(node: ts.Node): boolean {
        if (
            // 261  interface PromiseInterface extends Promise<T>
            !ts.isInterfaceDeclaration(node) &&
            // 260  class PromiseClass implements Promise<T>
            !ts.isClassDeclaration(node) &&
            // 230  Promise<T>
            !ts.isExpressionWithTypeArguments(node) &&
            // 262  type PromiseAlias = Promise<T>;
            !ts.isTypeAliasDeclaration(node)
        ) {
            return false;
        }

        const type = this.typeChecker.getTypeAtLocation(node);

        // @ts-expect-error - Internal API of TypeScript
        const awaitedType = this.typeChecker.getAwaitedType(type);

        // If the awaited type differs from the original type, the type extends promise
        // Awaited<Promise<T>> -> T (Promise<T> !== T)
        // Awaited<Y> -> Y (Y === Y)
        return awaitedType !== type;
    }

    public createType(
        node: ts.InterfaceDeclaration | ts.ClassDeclaration | ts.ExpressionWithTypeArguments | ts.TypeAliasDeclaration,
        context: Context
    ): BaseType {
        const type = this.typeChecker.getTypeAtLocation(node);

        // @ts-expect-error - Internal API of TypeScript
        const awaitedType = this.typeChecker.getAwaitedType(type);

        const awaitedNode = this.typeChecker.typeToTypeNode(awaitedType, undefined, ts.NodeBuilderFlags.NoTruncation);

        if (!awaitedNode) {
            throw new Error(
                `Could not find awaited node for type ${node.pos === -1 ? "<unresolved>" : node.getText()}`
            );
        }

        const baseNode = this.childNodeParser.createType(awaitedNode, context);

        const name = this.getNodeName(node);

        // Nodes without name should just be their awaited type
        // export class extends Promise<T> {} -> T
        // export class A extends Promise<T> {} -> A (ref to T)
        if (!name) {
            return baseNode;
        }

        return new DefinitionType(name, new AliasType(`promise-${getKey(node, context)}`, baseNode));
    }

    private getNodeName(
        node: ts.InterfaceDeclaration | ts.ClassDeclaration | ts.ExpressionWithTypeArguments | ts.TypeAliasDeclaration
    ) {
        if (ts.isExpressionWithTypeArguments(node)) {
            if (!ts.isHeritageClause(node.parent)) {
                throw new Error("Expected ExpressionWithTypeArguments to have a HeritageClause parent");
            }

            return node.parent.parent.name?.getText();
        }

        return node.name?.getText();
    }

    /**
     * If specified node extends Promise or PromiseLike and nothing else then this method returns the
     * array item type. In all other cases null is returned to indicate that the node is not a simple promise.
     *
     * @param node - The interface or class to check.
     * @return The promise item type if node is an promise, null otherwise.
     */
    protected getPromiseItemType(node: ts.InterfaceDeclaration | ts.ClassDeclaration): ts.TypeNode | null {
        if (node.heritageClauses && node.heritageClauses.length === 1) {
            const clause = node.heritageClauses[0];

            if (clause.types.length === 1) {
                const type = clause.types[0];
                const symbol = this.typeChecker.getSymbolAtLocation(type.expression);

                if (symbol && (symbol.name === "Promise" || symbol.name === "PromiseLike")) {
                    const typeArguments = type.typeArguments;

                    if (typeArguments?.length === 1) {
                        return typeArguments[0];
                    }
                }
            }
        }

        return null;
    }
}
