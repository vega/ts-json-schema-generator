import ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import type { SubNodeParser } from "../SubNodeParser";
import type { BaseType } from "../Type/BaseType";

/**
 * Needs to be registered before 261, 260, 230, 262 node kinds
 */
export class PromiseNodeParser implements SubNodeParser {
	public constructor(
		protected typeChecker: ts.TypeChecker,
		protected childNodeParser: NodeParser,
	) {}

	private awaitedMap = new WeakMap<ts.Type, ts.Type>();

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

		const type = this.typeChecker.getTypeFromTypeNode(this.toTypeNode(node));
		const cachedAwaitedType = this.awaitedMap.get(type);

		if (cachedAwaitedType) {
			return type !== cachedAwaitedType;
		}

		// @ts-expect-error - Internal API of TypeScript
		const awaitedType = this.typeChecker.getAwaitedType(type);

		if (awaitedType === type) {
			return false;
		}

		this.awaitedMap.set(type, awaitedType);
		return true;
	}

	public createType(
		node:
			| ts.InterfaceDeclaration
			| ts.ClassDeclaration
			| ts.ExpressionWithTypeArguments
			| ts.TypeAliasDeclaration,
		context: Context,
	): BaseType {
		const type = this.typeChecker.getTypeFromTypeNode(this.toTypeNode(node));

		const awaitedType = this.awaitedMap.get(type);

		if (!awaitedType) {
			throw new Error(
				`Missing awaited type on PromiseNodeParser for node ${
					node.pos === -1 ? "<unresolved>" : node.getText()
				}`,
			);
		}

		// Tries to find the internal symbol defined by the getAwaitedType function
		const declaration = awaitedType.aliasSymbol?.declarations?.[0];

		if (declaration && ts.isTypeAliasDeclaration(declaration)) {
			const ref = ts.factory.createTypeReferenceNode(declaration.name);

			// console.log({
			// 	node: node.getText(),
			// 	name: declaration.name.getText(),
			// 	type: declaration.type.kind,
			// 	typeText: declaration.type.getText(),
			// 	json: this.childNodeParser.createType(declaration.type, context),

			// 	ref: ref.pos !== -1 && ref.getText(),
			// 	kind: ref.kind,
			// 	jsonRef: this.childNodeParser.createType(
			// 		ref,
			// 		this.createSubContext(ref, context),
			// 	),
			// });

			return this.childNodeParser.createType(
				ref,
				this.createSubContext(ref, context),
			);
		}

		// Fallbacks to creating the TypeNode from the awaited type
		const typeNode = this.typeChecker.typeToTypeNode(
			awaitedType,
			node,
			ts.NodeBuilderFlags.NoTruncation,
		);

		if (!typeNode) {
			throw new Error("typeNode is undefined");
		}

		return this.childNodeParser.createType(typeNode, context);
	}

	protected createSubContext(
		node: ts.TypeReferenceNode,
		parentContext: Context,
	): Context {
		const subContext = new Context(node);

		if (node.typeArguments?.length) {
			for (const typeArg of node.typeArguments) {
				subContext.pushArgument(
					this.childNodeParser.createType(typeArg, parentContext),
				);
			}
		}

		return subContext;
	}

	private toTypeNode(
		node:
			| ts.InterfaceDeclaration
			| ts.ClassDeclaration
			| ts.ExpressionWithTypeArguments
			| ts.TypeAliasDeclaration,
	): ts.TypeNode {
		if (ts.isClassLike(node) || ts.isInterfaceDeclaration(node)) {
			return (
				// Currently, when a `class A extends Promise<T>, SomethingElse {}` (multiple heritage clauses)
				// we ignore the class and return the first heritage clause
				node.heritageClauses?.[0].types[0] ||
				this.typeChecker.typeToTypeNode(
					node,
					undefined,
					ts.NodeBuilderFlags.NoTruncation,
				)
			);
		}

		if (ts.isTypeAliasDeclaration(node)) {
			return node.type;
		}

		return node;
	}
}
