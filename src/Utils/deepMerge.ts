import type { JSONSchema7Definition } from "json-schema";
import type { Definition } from "../Schema/Definition.js";
import type { RawType, RawTypeName } from "../Schema/RawType.js";
import { intersectionOfArrays } from "./intersectionOfArrays.js";
import { uniqueArray } from "./uniqueArray.js";

/**
 * Merges property definitions, recursively combining inline objects.
 *
 * @param a - lhs to merge.
 * @param b - rhs to merge.
 * @returns a and b merged together.
 */
export function deepMerge(
    a: { [key: string]: JSONSchema7Definition },
    b: { [key: string]: JSONSchema7Definition },
): { [x: string]: JSONSchema7Definition } {
    const output = { ...structuredClone(a), ...structuredClone(b) };

    for (const key in a) {
        if (b.hasOwnProperty(key)) {
            const elementA = a[key as keyof Definition];
            const elementB = b[key as keyof Definition];

            if (
                elementA != null &&
                elementB != null &&
                typeof elementA === "object" &&
                typeof elementB === "object" &&
                "type" in elementA &&
                "type" in elementB
            ) {
                if (elementA.type === "object" && elementB.type === "object") {
                    output[key] = mergeObjectDefinitions(structuredClone(elementB), elementA);
                }
                if (elementA.type == elementB.type) {
                    const enums = mergeConstsAndEnums(elementA, elementB);
                    if (enums != null) {
                        const isSingle = enums.length === 1;
                        (output as any)[key][isSingle ? "const" : "enum"] = isSingle ? enums[0] : enums;
                        delete (output as any)[key][isSingle ? "enum" : "const"];
                    }
                }
            }
        }
    }

    return output;
}

function mergeConstsAndEnums(a: Definition, b: Definition): RawType[] | undefined {
    // NOTE: const is basically a syntactic sugar for an enum with a single element.
    const enumA = a.const !== undefined ? [a.const] : a.enum;
    const enumB = b.const !== undefined ? [b.const] : b.enum;

    if (enumA == null && enumB != null) {
        return enumB;
    } else if (enumA != null && enumB == null) {
        return enumA;
    } else if (enumA != null && enumB != null) {
        return intersectionOfArrays(enumA, enumB);
    } else {
        return undefined;
    }
}

/** Combines object properties, required keys, and additional-property rules. Mutates definition. */
export function mergeObjectDefinitions(definition: Definition, other: Definition): Definition {
    definition.properties = deepMerge(other.properties || {}, definition.properties || {});

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
