import * as ts from "typescript";
import { Context, NodeParser } from "./NodeParser";
import { Definition } from "./Schema/Definition";
import { Schema } from "./Schema/Schema";
import { BaseType } from "./Type/BaseType";
import { DefinitionType } from "./Type/DefinitionType";
import { TypeFormatter } from "./TypeFormatter";
import { StringMap } from "./Utils/StringMap";
import { notUndefined } from "./Utils/notUndefined";
import { removeUnreachable } from "./Utils/removeUnreachable";
import { Config } from "./Config";

export class SchemaGenerator {
    public constructor(
        private readonly program: ts.Program,
        private readonly nodeParser: NodeParser,
        private readonly typeFormatter: TypeFormatter,
        private readonly config?: Config
    ) {}

    public createSchema(fullName?: string): Schema {
        return this.createSchemaFromNodes();
    }

    public createSchemaFromNodes(): Schema {
        const rootFileNames = this.program.getRootFileNames();
        const rootSourceFiles = this.program
            .getSourceFiles()
            .filter((sourceFile) => rootFileNames.includes(sourceFile.fileName));

        const rootTypes = rootSourceFiles
            .map((sourceFile) => {
                return this.nodeParser.createType(sourceFile, new Context());
            })
            .filter(notUndefined);

        const rootTypeDefinition = rootTypes.length === 1 ? this.getRootTypeDefinition(rootTypes[0]) : undefined;
        const definitions: StringMap<Definition> = {};
        rootTypes.forEach((rootType) => this.appendRootChildDefinitions(rootType, definitions));

        const reachableDefinitions = removeUnreachable(rootTypeDefinition, definitions);

        return {
            $schema: "http://json-schema.org/draft-07/schema#",
            ...(rootTypeDefinition ?? {}),
            definitions: reachableDefinitions,
        };
    }
    private getRootTypeDefinition(rootType: BaseType): Definition {
        return this.typeFormatter.getDefinition(rootType);
    }
    private appendRootChildDefinitions(rootType: BaseType, childDefinitions: StringMap<Definition>): void {
        const seen = new Set<string>();

        const children = this.typeFormatter
            .getChildren(rootType)
            .filter((child): child is DefinitionType => child instanceof DefinitionType)
            .filter((child) => {
                if (!seen.has(child.getId())) {
                    seen.add(child.getId());
                    return true;
                }
                return false;
            });

        const ids = new Map<string, string>();
        for (const child of children) {
            const name = child.getName();

            const previousId = ids.get(name);
            if (previousId && child.getId() !== previousId) {
                // throw new Error(`Type "${name}" has multiple definitions.`);

                // export overrides are allowed
                console.warn(`Type "${name}" has multiple definitions.`);
            }
            ids.set(name, child.getId());
        }

        children.reduce((definitions, child) => {
            const name = child.getName();
            if (!(name in definitions)) {
                definitions[name] = this.typeFormatter.getDefinition(child.getType());
            }
            return definitions;
        }, childDefinitions);
    }
}
