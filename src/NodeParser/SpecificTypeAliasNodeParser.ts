import { JSONSchema7TypeName } from "json-schema";
import * as ts from "typescript";
import { Context } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { ReferenceType } from "../Type/ReferenceType";
import { SpecificObjectType } from "../Type/SpecificObjectType";
import { getKey } from "../Utils/nodeKey";

export interface TypeTarget {
    name: string;
    moduleName?: string;
    definitionType?: JSONSchema7TypeName;
    multiple?: boolean;
}

export class SpecificTypeAliasNodeParser implements SubNodeParser {
    public constructor(private typeChecker: ts.TypeChecker, private typeTargets: TypeTarget[]) {}

    public supportsNode(node: ts.TypeAliasDeclaration): boolean {
        return node.kind === ts.SyntaxKind.TypeAliasDeclaration && this.getSpecificTarget(node) !== undefined;
    }

    public createType(node: ts.TypeAliasDeclaration, context: Context, reference?: ReferenceType): BaseType {
        const typeTarget = this.getSpecificTarget(node)!;
        return new SpecificObjectType(
            `specificobject-${getKey(node, context)}`,
            typeTarget.definitionType || (typeTarget.name as JSONSchema7TypeName),
            !!typeTarget.multiple
        );
    }

    private getSpecificTarget(node: ts.TypeAliasDeclaration): TypeTarget | undefined {
        return this.typeTargets.find((item) => {
            if (item.name !== node.name.text) {
                return false;
            }

            if (item.moduleName && item.moduleName !== this.findModuleDeclarationName(node)) {
                return false;
            }

            return true;
        });
    }

    private findModuleDeclarationName(node: ts.TypeAliasDeclaration): string | undefined {
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
