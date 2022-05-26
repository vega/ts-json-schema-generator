import ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { isAssignableTo, resolveInfer } from "../Utils/isAssignableTo";
import { narrowType } from "../Utils/narrowType";
import { UnionType } from "../Type/UnionType";

export class ConditionalTypeNodeParser implements SubNodeParser {
    public constructor(protected typeChecker: ts.TypeChecker, protected childNodeParser: NodeParser) {}

    public supportsNode(node: ts.ConditionalTypeNode): boolean {
        return node.kind === ts.SyntaxKind.ConditionalType;
    }

    public createType(node: ts.ConditionalTypeNode, context: Context): BaseType | undefined {
        const checkType = this.childNodeParser.createType(node.checkType, context);
        const extendsType = this.childNodeParser.createType(node.extendsType, context);
        const checkTypeParameterName = this.getTypeParameterName(node.checkType);

        // console.log("checkType");
        // console.log(checkType);
        // console.log("extendsType");
        // console.log(extendsType);
        // console.log("checkTypeParameterName");
        // console.log(checkTypeParameterName);

        // If check-type is not a type parameter then condition is very simple, no type narrowing needed
        if (checkTypeParameterName == null) {
            const result = isAssignableTo(extendsType, checkType);
            return this.childNodeParser.createType(result ? node.trueType : node.falseType, context);
        }

        // Narrow down check type for both condition branches
        let inferMap = new Map();
        const trueCheckType = narrowType(checkType, (type) => resolveInfer(extendsType, type, new Set(), inferMap));
        // console.log(`trueCheckType: ${trueCheckType}`);
        // console.log(trueCheckType);
        // console.log(node.trueType);
        const falseCheckType = narrowType(checkType, (type) => !resolveInfer(extendsType, type, new Set(), new Map()));
        // console.log(`falseCheckType: ${falseCheckType}`);
        // console.log(falseCheckType);

        // Follow the relevant branches and return the results from them
        const results: BaseType[] = [];
        if (trueCheckType !== undefined) {
            // console.log("TRUE");
            // console.log(resolveInfer(extendsType, checkType, new Set()));
            // console.log(node.trueType);
            const result = this.childNodeParser.createType(
                node.trueType,
                this.createSubContext(node, checkTypeParameterName, trueCheckType, context, inferMap)
            );
            // console.log(result);
            if (result) {
                results.push(result);
            }
        }
        if (falseCheckType !== undefined) {
            // console.log("FALSE");
            // console.log(context.getParameters());
            // if (context.getParameters().length == 1) {
            //     console.log(context.getArgument("T"));
            //     console.log(inferMap)
            // }
            const result = this.childNodeParser.createType(
                node.falseType,
                this.createSubContext(node, checkTypeParameterName, falseCheckType, context)
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
     * @param checkTypeParameterName - The type parameter name of the check-type.
     * @param narrowedCheckType      - The narrowed down check type to use for the type parameter in sub parsers.
     * @return The created sub context.
     */
    protected createSubContext(
        node: ts.ConditionalTypeNode,
        checkTypeParameterName: string,
        narrowedCheckType: BaseType,
        parentContext: Context,
        inferMap: Map<string, BaseType> = new Map()
    ): Context {
        const subContext = new Context(node);

        // Set new narrowed type for check type parameter
        subContext.pushParameter(checkTypeParameterName);
        subContext.pushArgument(narrowedCheckType);

        inferMap.forEach((value, key) => {
            subContext.pushParameter(key);
            subContext.pushArgument(value);
        });

        // Copy all other type parameters from parent context
        // TODO: Check whether this is correct
        parentContext.getParameters().forEach((parentParameter) => {
            if (parentParameter !== checkTypeParameterName && !(parentParameter in inferMap)) {
                subContext.pushParameter(parentParameter);
                subContext.pushArgument(parentContext.getArgument(parentParameter));
            }
        });

        return subContext;
    }
}
