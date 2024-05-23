import ts from "typescript";
import { ExpectationFailedError } from "../Error/Errors.js";
import { Context, type NodeParser } from "../NodeParser.js";
import type { SubNodeParser } from "../SubNodeParser.js";
import { AliasType } from "../Type/AliasType.js";
import type { BaseType } from "../Type/BaseType.js";
import { DefinitionType } from "../Type/DefinitionType.js";
import { getKey } from "../Utils/nodeKey.js";

/**
 * Needs to be registered before 261, 260, 230, 262 node kinds
 */
export class PromiseNodeParser implements SubNodeParser {
    public constructor(
        protected typeChecker: ts.TypeChecker,
        protected childNodeParser: NodeParser,
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

        const awaitedType = this.typeChecker.getAwaitedType(type);

        // ignores non awaitable types
        if (!awaitedType) {
            return false;
        }

        // If the awaited type differs from the original type, the type extends promise
        // Awaited<Promise<T>> -> T (Promise<T> !== T)
        // Awaited<Y> -> Y (Y === Y)
        if (awaitedType === type) {
            return false;
        }

        // In types like: A<T> = T, type C = A<1>, C has the same type as A<1> and 1,
        // the awaitedType is NOT the same reference as the type, so a assignability
        // check is needed
        return (
            !this.typeChecker.isTypeAssignableTo(type, awaitedType) &&
            !this.typeChecker.isTypeAssignableTo(awaitedType, type)
        );
    }

    public createType(
        node: ts.InterfaceDeclaration | ts.ClassDeclaration | ts.ExpressionWithTypeArguments | ts.TypeAliasDeclaration,
        context: Context,
    ): BaseType {
        const type = this.typeChecker.getTypeAtLocation(node);
        const awaitedType = this.typeChecker.getAwaitedType(type)!; // supportsNode ensures this
        const awaitedNode = this.typeChecker.typeToTypeNode(awaitedType, undefined, ts.NodeBuilderFlags.IgnoreErrors);

        if (!awaitedNode) {
            throw new ExpectationFailedError("Could not find awaited node", node);
        }

        const baseNode = this.childNodeParser.createType(awaitedNode, new Context(node));

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
        node: ts.InterfaceDeclaration | ts.ClassDeclaration | ts.ExpressionWithTypeArguments | ts.TypeAliasDeclaration,
    ) {
        if (ts.isExpressionWithTypeArguments(node)) {
            if (!ts.isHeritageClause(node.parent)) {
                throw new ExpectationFailedError(
                    "Expected ExpressionWithTypeArguments to have a HeritageClause parent",
                    node.parent,
                );
            }

            return node.parent.parent.name?.getText();
        }

        return node.name?.getText();
    }
}
