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

/**
 * Deep-clone a schema and copy `$ref` source metadata onto every nested schema.
 * `structuredClone` alone drops the WeakMap entries.
 */
export function cloneSchema<T extends JSONSchema7Definition>(schema: T): T {
    if (typeof schema !== "object") {
        return schema;
    }

    const cloned = structuredClone(schema);
    reattachSchemaSources(schema, cloned);
    return cloned;
}

export function cloneSchemaMap(schemas: { [key: string]: JSONSchema7Definition }): {
    [key: string]: JSONSchema7Definition;
} {
    const cloned: { [key: string]: JSONSchema7Definition } = {};
    for (const key of Object.keys(schemas)) {
        cloned[key] = cloneSchema(schemas[key]);
    }
    return cloned;
}

function reattachSchemaSources(original: object, copy: object): void {
    const seen = new WeakSet<object>();

    const visit = (from: unknown, to: unknown): void => {
        if (typeof from !== "object" || from === null || typeof to !== "object" || to === null || seen.has(from)) {
            return;
        }
        seen.add(from);
        copySchemaSource(from, to);

        if (Array.isArray(from) && Array.isArray(to)) {
            for (const [index, value] of from.entries()) {
                visit(value, to[index]);
            }
            return;
        }
        if (Array.isArray(from) || Array.isArray(to)) {
            return;
        }

        const fromRecord = from as Record<string, unknown>;
        const toRecord = to as Record<string, unknown>;
        for (const key of Object.keys(fromRecord)) {
            visit(fromRecord[key], toRecord[key]);
        }
    };

    visit(original, copy);
}
