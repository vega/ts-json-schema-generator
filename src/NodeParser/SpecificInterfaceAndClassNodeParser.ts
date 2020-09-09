import * as ts from "typescript";
import { Context } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { ReferenceType } from "../Type/ReferenceType";
import { SpecificObjectType } from "../Type/SpecificObjectType";
import { getKey } from "../Utils/nodeKey";

export interface InterfaceTarget {
    name: string;
    moduleName?: string;
    definitionType?: string;
    multiple?: boolean;
}

export class SpecificInterfaceAndClassNodeParser implements SubNodeParser {
    public constructor(private typeChecker: ts.TypeChecker, private interfaceTargets: InterfaceTarget[]) {}

    public supportsNode(node: ts.ClassDeclaration | ts.InterfaceDeclaration): boolean {
        return (
            (node.kind === ts.SyntaxKind.ClassDeclaration || node.kind === ts.SyntaxKind.InterfaceDeclaration) &&
            this.getSpecificTarget(node) !== undefined
        );
    }

    public createType(node: ts.InterfaceDeclaration, context: Context, reference?: ReferenceType): BaseType {
        const interfaceTarget = this.getSpecificTarget(node)!;
        return new SpecificObjectType(
            `specificobject-${getKey(node, context)}`,
            interfaceTarget.definitionType || interfaceTarget.name,
            !!interfaceTarget.multiple
        );
    }

    private getSpecificTarget(node: ts.ClassDeclaration | ts.InterfaceDeclaration): InterfaceTarget | undefined {
        let interfaceTarget = this.interfaceTargets.find((item) => {
            if (node.name && item.name !== node.name.text) {
                return false;
            }

            if (item.moduleName && item.moduleName !== this.findModuleDeclarationName(node)) {
                return false;
            }

            return true;
        });

        if (!interfaceTarget && node.heritageClauses) {
            node.heritageClauses.find((heritageClause) => {
                return heritageClause.types.find((type) => {
                    const typeSymbol = this.typeChecker.getSymbolAtLocation(type.expression);

                    if (typeSymbol && typeSymbol.declarations.length > 0) {
                        const declaration = typeSymbol.declarations[0];

                        if (ts.isClassDeclaration(declaration) || ts.isInterfaceDeclaration(declaration)) {
                            interfaceTarget = this.getSpecificTarget(declaration);
                        }
                    }

                    return !!interfaceTarget;
                });
            });
        }

        return interfaceTarget;
    }

    private findModuleDeclarationName(node: ts.ClassDeclaration | ts.InterfaceDeclaration): string | undefined {
        let parent = node.parent;
        if (ts.isModuleBlock(parent)) {
            parent = parent.parent;
        }

        if (ts.isModuleDeclaration(parent)) {
            return parent.name.text;
        }

        return undefined;
    }
}
