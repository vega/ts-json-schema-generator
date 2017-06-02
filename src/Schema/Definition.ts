export type PrimitiveType = number | boolean | string | null;

export interface Definition {
    $ref?: string;
    description?: string;
    allOf?: Definition[];
    oneOf?: Definition[];
    anyOf?: Definition[];
    title?: string;
    type?: string | string[];
    definitions?: {[key: string]: any};
    format?: string;
    items?: Definition;
    minItems?: number;
    additionalItems?: {
        anyOf: Definition,
    };
    enum?: PrimitiveType[] | Definition[];
    default?: PrimitiveType | Object;
    additionalProperties?: false | Definition;
    required?: string[];
    propertyOrder?: string[];
    properties?: {};
    defaultProperties?: string[];

    typeof?: "function";
};
