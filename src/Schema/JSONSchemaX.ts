import {
    JSONSchema7, JSONSchema7Array,
    JSONSchema7Definition, JSONSchema7Object,
    JSONSchema7Type,
    JSONSchema7TypeName,
    JSONSchema7Version
} from "json-schema";

export type JSONSchemaXType = JSONSchema7Type;
export type JSONSchemaXTypeName = JSONSchema7TypeName | "function" | "promise";

export type JSONSchemaXDefinition = JSONSchemaX | boolean;

export interface JSONSchemaX {
    $id?: string;
    $ref?: string;
    $schema?: JSONSchema7Version;
    $comment?: string;

    /**
     * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.1
     */
    type?: JSONSchemaXTypeName | JSONSchemaXTypeName[];
    enum?: JSONSchemaXType[];
    const?: JSONSchemaXType;

    /**
     * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.2
     */
    multipleOf?: number;
    maximum?: number;
    exclusiveMaximum?: number;
    minimum?: number;
    exclusiveMinimum?: number;

    /**
     * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.3
     */
    maxLength?: number;
    minLength?: number;
    pattern?: string;

    /**
     * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.4
     */
    items?: JSONSchemaXDefinition | JSONSchemaXDefinition[];
    additionalItems?: JSONSchemaXDefinition;
    maxItems?: number;
    minItems?: number;
    uniqueItems?: boolean;
    contains?: JSONSchema7;

    /**
     * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.5
     */
    maxProperties?: number;
    minProperties?: number;
    required?: string[];
    properties?: {
        [key: string]: JSONSchemaXDefinition;
    };
    patternProperties?: {
        [key: string]: JSONSchemaXDefinition;
    };
    additionalProperties?: JSONSchemaXDefinition;
    dependencies?: {
        [key: string]: JSONSchemaXDefinition | string[];
    };
    propertyNames?: JSONSchemaXDefinition;

    /**
     * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.6
     */
    if?: JSONSchemaXDefinition;
    then?: JSONSchemaXDefinition;
    else?: JSONSchemaXDefinition;

    /**
     * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.7
     */
    allOf?: JSONSchemaXDefinition[];
    anyOf?: JSONSchemaXDefinition[];
    oneOf?: JSONSchemaXDefinition[];
    not?: JSONSchemaXDefinition;

    /**
     * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-7
     */
    format?: string;

    /**
     * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-8
     */
    contentMediaType?: string;
    contentEncoding?: string;

    /**
     * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-9
     */
    definitions?: {
        [key: string]: JSONSchemaXDefinition;
    };

    /**
     * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-10
     */
    title?: string;
    description?: string;
    default?: JSONSchemaXType;
    readOnly?: boolean;
    writeOnly?: boolean;
    examples?: JSONSchemaXType;

    /**
     * custom function signature
     */
    arguments?: {
        [key: string]: JSONSchemaX;
    };
    return?: JSONSchemaX;
}
