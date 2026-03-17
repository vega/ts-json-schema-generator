import type { Definition } from "../Schema/Definition.js";
import type { SubTypeFormatter } from "../SubTypeFormatter.js";
import type { BaseType } from "../Type/BaseType.js";
import { UnionType } from "../Type/UnionType.js";
import type { GetDefinitionOptions } from "../TypeFormatter.js";
import type { TypeFormatter } from "../TypeFormatter.js";
type DiscriminatorType = "json-schema" | "open-api";
export declare class UnionTypeFormatter implements SubTypeFormatter {
    protected childTypeFormatter: TypeFormatter;
    private discriminatorType?;
    constructor(childTypeFormatter: TypeFormatter, discriminatorType?: DiscriminatorType | undefined);
    supportsType(type: BaseType): boolean;
    private getTypeDefinitions;
    private getJsonSchemaDiscriminatorDefinition;
    private getOpenApiDiscriminatorDefinition;
    getDefinition(type: UnionType, options?: GetDefinitionOptions): Definition;
    getChildren(type: UnionType): BaseType[];
}
export {};
