import * as ts from "typescript";
import { NoRootTypeError } from "./Error/NoRootTypeError";
import { Context, NodeParser } from "./NodeParser";
import { Definition } from "./Schema/Definition";
import { Schema } from "./Schema/Schema";
import { BaseType } from "./Type/BaseType";
import { DefinitionType } from "./Type/DefinitionType";
import { TypeFormatter } from "./TypeFormatter";
import { StringMap } from "./Utils/StringMap";
import { localSymbolAtNode, symbolAtNode } from "./Utils/symbolAtNode";

export class SchemaGenerator {
    private allTypes: Map<string, ts.Node>;
    private prioritizedFiles: ts.SourceFile[];
    private unprioritizedFiles: ts.SourceFile[];

    public constructor(
        private program: ts.Program,
        private nodeParser: NodeParser,
        private typeFormatter: TypeFormatter,
    ) {
        this.allTypes = new Map<string, ts.Node>();

        const sourceFiles = this.program.getSourceFiles();
        this.prioritizedFiles = [];
        this.unprioritizedFiles = [];
        sourceFiles.forEach((f) => {
            if (!f.fileName.includes("/node_modules/")) {
                this.prioritizedFiles.push(f);
            } else {
                this.unprioritizedFiles.push(f);
            }
        });
    }

    public createSchema(fullName: string): Schema {
        const rootNode = this.findRootNode(fullName);
        const rootType = this.nodeParser.createType(rootNode, new Context());

        return {
            $schema: "http://json-schema.org/draft-06/schema#",
            definitions: this.getRootChildDefinitions(rootType),
            ...this.getRootTypeDefinition(rootType),
        };
    }

    private findRootNode(fullName: string): ts.Node {
        const typeChecker = this.program.getTypeChecker();

        if (this.prioritizedFiles.length) {
            this.prioritizedFiles.forEach(
                (sourceFile) => {
                    this.inspectNode(sourceFile, typeChecker, this.allTypes);
                },
            );
            this.prioritizedFiles = [];
        }

        if (this.allTypes.has(fullName)) {
            return this.allTypes.get(fullName)!;
        }

        if (this.unprioritizedFiles.length) {
            this.unprioritizedFiles.forEach(
                (sourceFile) => {
                    this.inspectNode(sourceFile, typeChecker, this.allTypes);
                },
            );
            this.unprioritizedFiles = [];
        }

        if (this.allTypes.has(fullName)) {
            return this.allTypes.get(fullName)!;
        }

        throw new NoRootTypeError(fullName);
    }
    private inspectNode(node: ts.Node, typeChecker: ts.TypeChecker, allTypes: Map<string, ts.Node>): void {
        if (
            node.kind === ts.SyntaxKind.InterfaceDeclaration ||
            node.kind === ts.SyntaxKind.EnumDeclaration ||
            node.kind === ts.SyntaxKind.TypeAliasDeclaration
        ) {
            if (!this.isExportType(node)) {
                return;
            } else if (this.isGenericType(node as ts.TypeAliasDeclaration)) {
                return;
            }

            allTypes.set(this.getFullName(node, typeChecker), node);
        } else {
            ts.forEachChild(node, (subnode) => this.inspectNode(subnode, typeChecker, allTypes));
        }
    }

    private isExportType(node: ts.Node): boolean {
        const localSymbol = localSymbolAtNode(node);
        return localSymbol ? "exportSymbol" in localSymbol : false;
    }
    private isGenericType(node: ts.TypeAliasDeclaration): boolean {
        return !!(
            node.typeParameters &&
            node.typeParameters.length > 0
        );
    }
    private getFullName(node: ts.Node, typeChecker: ts.TypeChecker): string {
        const symbol = symbolAtNode(node)!;
        return typeChecker.getFullyQualifiedName(symbol).replace(/".*"\./, "");
    }

    private getRootTypeDefinition(rootType: BaseType): Definition {
        return this.typeFormatter.getDefinition(rootType);
    }
    private getRootChildDefinitions(rootType: BaseType): StringMap<Definition> {
        return this.typeFormatter.getChildren(rootType)
            .filter((child) => child instanceof DefinitionType)
            .reduce((result: StringMap<Definition>, child: DefinitionType) => ({
                ...result,
                [child.getId()]: this.typeFormatter.getDefinition(child.getType()),
            }), {});
    }
}
