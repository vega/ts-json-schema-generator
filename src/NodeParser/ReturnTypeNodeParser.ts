import ts from "typescript";
import type { Context, NodeParser } from "../NodeParser.js";
import type { SubNodeParser } from "../SubNodeParser.js";
import type { BaseType } from "../Type/BaseType.js";
import { UnknownNodeError } from "../Error/Errors.js";
import { ObjectType } from "../Type/ObjectType.js";

export class ReturnTypeNodeParser implements SubNodeParser {
    constructor(
        private readonly childNodeParser: NodeParser,
        private readonly checker: ts.TypeChecker,
    ) {}

    supportsNode(node: ts.Node): boolean {
        return ts.isTypeReferenceNode(node) && 
               node.typeName.getText() === 'ReturnType' && 
               node.typeArguments?.length === 1;
    }

    createType(node: ts.TypeReferenceNode, context: Context): BaseType {
        try {
            if (!node.typeArguments || node.typeArguments.length !== 1) {
                throw new UnknownNodeError(node);
            }

            const typeArg = node.typeArguments[0];
            
            // If the type argument is a typeof expression
            if (ts.isTypeQueryNode(typeArg)) {
                // Get the symbol for the identifier
                const symbol = this.checker.getSymbolAtLocation(typeArg.exprName);
                if (!symbol) {
                    throw new UnknownNodeError(node);
                }

                // Get the declarations of the symbol
                const declarations = symbol.getDeclarations() || [];

                // Try multiple methods to extract return type
                for (const decl of declarations) {
                    let returnTypeNode: ts.TypeNode | undefined;

                    // If declaration is a function/method with explicit return type
                    if (
                        (ts.isFunctionDeclaration(decl) || ts.isMethodDeclaration(decl) || 
                         ts.isArrowFunction(decl) || ts.isFunctionExpression(decl)) && 
                        decl.type
                    ) {
                        returnTypeNode = decl.type;
                    } 
                    // If declaration is a variable with function type annotation
                    else if (
                        ts.isVariableDeclaration(decl) && 
                        decl.type && 
                        ts.isFunctionTypeNode(decl.type)
                    ) {
                        returnTypeNode = decl.type.type;
                    }

                    // If we found a return type node, process it
                    if (returnTypeNode) {
                        const baseType = this.childNodeParser.createType(returnTypeNode, context);
                        return baseType;
                    }
                }

                // Fallback to type checking method
                const type = this.checker.getTypeOfSymbolAtLocation(symbol, typeArg);
                const signatures = type.getCallSignatures();

                if (signatures.length > 0) {
                    // Use getReturnType directly from the signature
                    const returnType = signatures[0].getReturnType();
                    
                    const returnTypeNode = this.checker.typeToTypeNode(
                        returnType, 
                        undefined, 
                        ts.NodeBuilderFlags.NoTruncation
                    );

                    if (returnTypeNode) {
                        return this.childNodeParser.createType(returnTypeNode, context);
                    }
                }
            }

            // If the above methods fail, try to get type directly
            const type = this.checker.getTypeAtLocation(typeArg);
            const typeNode = this.checker.typeToTypeNode(
                type, 
                undefined, 
                ts.NodeBuilderFlags.NoTruncation
            );
            
            if (typeNode) {
                return this.childNodeParser.createType(typeNode, context);
            }

            throw new UnknownNodeError(node);
        } catch (error) {
            throw error;
        }
    }
}
