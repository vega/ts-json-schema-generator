import ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { isAssignableTo } from "../Utils/isAssignableTo";
import { narrowType } from "../Utils/narrowType";
import { UnionType } from "../Type/UnionType";
import { NeverType } from "../Type/NeverType";

class CheckType {
    constructor(
        public parameterName: string,
        public type: BaseType
    ) {}
}

export class ConditionalTypeNodeParser implements SubNodeParser {
    public constructor(
        protected typeChecker: ts.TypeChecker,
        protected childNodeParser: NodeParser
    ) {}

    public supportsNode(node: ts.ConditionalTypeNode): boolean {
        return node.kind === ts.SyntaxKind.ConditionalType;
    }

    public createType(node: ts.ConditionalTypeNode, context: Context): BaseType {
        const checkType = this.childNodeParser.createType(node.checkType, context);
        const extendsType = this.childNodeParser.createType(node.extendsType, context);
        const checkTypeParameterName = this.getTypeParameterName(node.checkType);

        const inferMap = new Map();

        // If check-type is not a type parameter then condition is very simple, no type narrowing needed
        if (checkTypeParameterName == null) {
            const result = isAssignableTo(extendsType, checkType, inferMap);
            return this.childNodeParser.createType(
                result ? node.trueType : node.falseType,
                this.createSubContext(node, context, undefined, result ? inferMap : new Map())
            );
        }

        // Narrow down check type for both condition branches
        const trueCheckType = narrowType(checkType, (type) => isAssignableTo(extendsType, type, inferMap));
        const falseCheckType = narrowType(checkType, (type) => !isAssignableTo(extendsType, type));

        // Follow the relevant branches and return the results from them
        const results: BaseType[] = [];
        if (!(trueCheckType instanceof NeverType)) {
            const result = this.childNodeParser.createType(
                node.trueType,
                this.createSubContext(node, context, new CheckType(checkTypeParameterName, trueCheckType), inferMap)
            );
            if (result) {
                results.push(result);
            }
        }
        if (!(falseCheckType instanceof NeverType)) {
            const result = this.childNodeParser.createType(
                node.falseType,
                this.createSubContext(node, context, new CheckType(checkTypeParameterName, falseCheckType))
            );
            if (result) {
                results.push(result);
            }
        }
        return new UnionType(results).normalize();
    }

    /**
     * Returns the type parameter name of the given type node if any.
     *
     * @param node - The type node for which to return the type parameter name.
     * @return The type parameter name or null if specified type node is not a type parameter.
     */
    protected getTypeParameterName(node: ts.TypeNode): string | null {
        if (ts.isTypeReferenceNode(node)) {
            const typeSymbol = this.typeChecker.getSymbolAtLocation(node.typeName)!;
            if (typeSymbol.flags & ts.SymbolFlags.TypeParameter) {
                return typeSymbol.name;
            }
        }
        return null;
    }

    /**
     * Creates a sub context for evaluating the sub types of the conditional type. A sub context is needed in case
     * the check-type is a type parameter which is then narrowed down by the extends-type.
     *
     * @param node                   - The reference node for the new context.
     * @param checkType              - An object containing the type parameter name of the check-type, and the narrowed
     *                                 down check type to use for the type parameter in sub parsers.
     * @param inferMap               - A map that links parameter names to their inferred types.
     * @return The created sub context.
     */
    protected createSubContext(
        node: ts.ConditionalTypeNode,
        parentContext: Context,
        checkType?: CheckType,
        inferMap: Map<string, BaseType> = new Map()
    ): Context {
        const subContext = new Context(node);

        // Newly inferred types take precedence over check and parent types.
        inferMap.forEach((value, key) => {
            subContext.pushParameter(key);
            subContext.pushArgument(value);
        });

        if (checkType !== undefined) {
            // Set new narrowed type for check type parameter
            if (!(checkType.parameterName in inferMap)) {
                subContext.pushParameter(checkType.parameterName);
                subContext.pushArgument(checkType.type);
            }
        }

        // Copy all other type parameters from parent context
        parentContext.getParameters().forEach((parentParameter) => {
            if (parentParameter !== checkType?.parameterName && !(parentParameter in inferMap)) {
                subContext.pushParameter(parentParameter);
                subContext.pushArgument(parentContext.getArgument(parentParameter));
            }
        });

        return subContext;
    }
}
