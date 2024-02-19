import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { BaseType } from "../Type/BaseType";
import { UnionType } from "../Type/UnionType";
import { TypeFormatter } from "../TypeFormatter";
type DiscriminatorType = "json-schema" | "open-api";
export declare class UnionTypeFormatter implements SubTypeFormatter {
    protected childTypeFormatter: TypeFormatter;
    private discriminatorType?;
    constructor(childTypeFormatter: TypeFormatter, discriminatorType?: DiscriminatorType | undefined);
    supportsType(type: UnionType): boolean;
    private getTypeDefinitions;
    private getJsonSchemaDiscriminatorDefinition;
    private getOpenApiDiscriminatorDefinition;
    getDefinition(type: UnionType): Definition;
    getChildren(type: UnionType): BaseType[];
}
export {};
