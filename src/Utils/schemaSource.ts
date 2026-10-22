import type { JSONSchema7Definition } from "json-schema";
import type { BaseType } from "../Type/BaseType.js";

/**
 * Links a `$ref` schema object back to the type it names.
 * Kept off the schema so serialization and deep equality stay unchanged.
 */
const schemaSources = new WeakMap<object, BaseType>();

export function attachSchemaSource(schema: object, type: BaseType): void {
    schemaSources.set(schema, type);
}

export function copySchemaSource(from: object, to: object): void {
    const type = schemaSources.get(from);
    if (type) {
        schemaSources.set(to, type);
    }
}

export function readSchemaSource(schema: JSONSchema7Definition): BaseType | undefined {
    if (typeof schema !== "object") {
        return undefined;
    }

    return schemaSources.get(schema);
}
