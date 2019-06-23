import * as ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { isAssignableTo } from "../Utils/isAssignableTo";
import { narrowType } from "../Utils/narrowType";

export class ConditionalTypeNodeParser implements SubNodeParser {
    public constructor(
        private typeChecker: ts.TypeChecker,
        private childNodeParser: NodeParser,
    ) {}

    public supportsNode(node: ts.ConditionalTypeNode): boolean {
        return node.kind === ts.SyntaxKind.ConditionalType;
    }

    public createType(node: ts.ConditionalTypeNode, context: Context): BaseType {
        const checkType = this.childNodeParser.createType(node.checkType, context);
        const extendsType = this.childNodeParser.createType(node.extendsType, context);
        const result = isAssignableTo(extendsType, checkType);
        const tsResultType = result ? node.trueType : node.falseType;
        const resultType = this.childNodeParser.createType(tsResultType, context);

        // If result type is the same type parameter as the check type then narrow down the result type
        const checkTypeParameterName = this.getTypeParameterName(node.checkType);
        const resultTypeParameterName = this.getTypeParameterName(tsResultType);
        if (resultTypeParameterName != null && resultTypeParameterName === checkTypeParameterName) {
            return narrowType(resultType, type => isAssignableTo(extendsType, type) === result);
        }

        return resultType;
    }

    /**
     * Returns the type parameter name of the given type node if any.
     *
     * @param node - The type node for which to return the type parameter name.
     * @return The type parameter name or null if specified type node is not a type parameter.
     */
    private getTypeParameterName(node: ts.TypeNode): string | null {
        if (ts.isTypeReferenceNode(node)) {
            const typeSymbol = this.typeChecker.getSymbolAtLocation(node.typeName)!;
            if (typeSymbol.flags & ts.SymbolFlags.TypeParameter) {
                return typeSymbol.name;
            }
        }
        return null;
    }
}
