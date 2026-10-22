import type { JSONSchema7Definition } from "json-schema";
import type { Definition } from "../Schema/Definition.js";
import type { RawTypeName } from "../Schema/RawType.js";
import type { BaseType } from "../Type/BaseType.js";
import type { TypeFormatter } from "../TypeFormatter.js";
import { uniqueArray } from "./uniqueArray.js";
import { deepMerge } from "./deepMerge.js";
import { derefType } from "./derefType.js";
import { readSchemaSource } from "./schemaSource.js";

// TODO: Can we do this at parse time? See heritage clause in interfaces.
// TODO: We really only need this if the children use additionalProperties: false.
export function getAllOfDefinitionReducer(childTypeFormatter: TypeFormatter) {
    // combine object instead of using allOf because allOf does not work well with additional properties
    return (definition: Definition, baseType: BaseType): Definition => {
        return mergeObjectDefinitions(
            definition,
            childTypeFormatter.getDefinition(derefType(baseType)),
            childTypeFormatter,
        );
    };
}

/**
 * Merge `other` into `definition` the same way interface heritage and intersections merge objects.
 * Mutates and returns `definition`.
 */
function mergeObjectDefinitions(definition: Definition, other: Definition, formatter: TypeFormatter): Definition {
    definition.properties = deepMerge(other.properties || {}, definition.properties || {});

    if (other.patternProperties || definition.patternProperties) {
        const merged = mergePatternProperties(
            other.patternProperties || {},
            definition.patternProperties || {},
            formatter,
        );
        if (Object.keys(merged).length > 0) {
            definition.patternProperties = merged;
        } else {
            delete definition.patternProperties;
        }
    }

    function additionalPropsDefinition(props?: boolean | Definition): props is Definition {
        return props !== undefined && props !== true;
    }

    if (
        additionalPropsDefinition(definition.additionalProperties) &&
        additionalPropsDefinition(other.additionalProperties)
    ) {
        // additional properties is false only if all children also set additional properties to false
        // collect additional properties and merge into a single definition
        let additionalProps: Definition[] = [];
        let additionalTypes: RawTypeName[] = [];
        const addAdditionalProps: (addProps: Definition) => void = (addProps: Definition) => {
            if (addProps) {
                if (addProps.anyOf) {
                    for (const prop of addProps.anyOf as Definition[]) {
                        if (prop.type) {
                            additionalTypes = additionalTypes.concat(
                                Array.isArray(prop.type) ? prop.type : [prop.type],
                            );
                        } else {
                            additionalProps.push(prop);
                        }
                    }
                } else if (addProps.type) {
                    additionalTypes = additionalTypes.concat(
                        Array.isArray(addProps.type) ? addProps.type : [addProps.type],
                    );
                } else {
                    additionalProps.push(addProps);
                }
            }
        };

        addAdditionalProps(definition.additionalProperties);
        addAdditionalProps(other.additionalProperties);

        additionalTypes = uniqueArray(additionalTypes);
        additionalProps = uniqueArray(additionalProps);

        if (additionalTypes.length > 1) {
            additionalProps.push({
                type: additionalTypes,
            });
        } else if (additionalTypes.length === 1) {
            additionalProps.push({
                type: additionalTypes[0],
            });
        }

        if (additionalProps.length > 1) {
            definition.additionalProperties = {
                anyOf: additionalProps,
            };
        } else if (additionalProps.length === 1) {
            if (Object.keys(additionalProps[0]).length === 0) {
                delete definition.additionalProperties;
            } else {
                definition.additionalProperties = additionalProps[0];
            }
        } else {
            definition.additionalProperties = false;
        }
    }

    if (other.required) {
        definition.required = uniqueArray((definition.required || []).concat(other.required)).sort();
    }

    if (
        (other.additionalProperties || other.additionalProperties === undefined) &&
        definition.additionalProperties == false
    ) {
        delete definition.additionalProperties;
    }

    return definition;
}

/**
 * Keep every pattern from either side. A pattern that exists on both sides must satisfy both schemas,
 * because this reducer flattens intersections rather than emitting `allOf` at the object level.
 */
function mergePatternProperties(
    incoming: { [pattern: string]: JSONSchema7Definition },
    current: { [pattern: string]: JSONSchema7Definition },
    formatter: TypeFormatter,
): { [pattern: string]: JSONSchema7Definition } {
    const merged: { [pattern: string]: JSONSchema7Definition } = {
        ...structuredClone(incoming),
        ...structuredClone(current),
    };

    for (const pattern of Object.keys(incoming)) {
        if (Object.prototype.hasOwnProperty.call(current, pattern)) {
            // Intersect the original schemas so a `$ref` can still be traced back to its type.
            merged[pattern] = intersectSchemas(current[pattern], incoming[pattern], formatter);
        }
    }

    return merged;
}

function intersectSchemas(
    left: JSONSchema7Definition,
    right: JSONSchema7Definition,
    formatter: TypeFormatter,
): JSONSchema7Definition {
    if (left === false || right === false) {
        return false;
    }
    if (left === true) {
        return right;
    }
    if (right === true) {
        return left;
    }

    // allOf of two closed objects rejects a property that exists on only one side.
    // Resolve `$ref`s to those objects, then merge them the same way as heritage.
    const leftObject = resolveObjectSchema(left, formatter);
    const rightObject = resolveObjectSchema(right, formatter);
    if (leftObject && rightObject) {
        return mergeObjectDefinitions(structuredClone(leftObject), structuredClone(rightObject), formatter);
    }

    return { allOf: [left, right] };
}

const resolvingSchemas = new WeakSet<object>();

function resolveObjectSchema(schema: JSONSchema7Definition, formatter: TypeFormatter): Definition | undefined {
    if (isObjectSchema(schema)) {
        return schema;
    }

    const source = readSchemaSource(schema);
    if (!source || typeof schema !== "object" || resolvingSchemas.has(schema)) {
        return undefined;
    }

    resolvingSchemas.add(schema);
    try {
        const resolved = formatter.getDefinition(derefType(source));
        return isObjectSchema(resolved) ? resolved : undefined;
    } finally {
        resolvingSchemas.delete(schema);
    }
}

function isObjectSchema(schema: JSONSchema7Definition): schema is Definition {
    if (typeof schema !== "object") {
        return false;
    }

    const { type } = schema;
    if (type === "object" || (Array.isArray(type) && type.includes("object"))) {
        return true;
    }

    return (
        schema.properties !== undefined ||
        schema.patternProperties !== undefined ||
        schema.additionalProperties !== undefined
    );
}
