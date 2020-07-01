import { JSONSchema7, JSONSchema7Definition } from "json-schema";
import { isArray, isBoolean } from "util";
import { Definition } from "./../Schema/Definition";
import { StringMap } from "./StringMap";

function addReachable(
    definition: Definition | JSONSchema7Definition,
    definitions: StringMap<Definition>,
    reachable: Set<string>
) {
    if (isBoolean(definition)) {
        return;
    }

    if (definition.$ref) {
        const typeName = decodeURIComponent(definition.$ref.slice(14));
        if (reachable.has(typeName)) {
            // we've already processed this definition
            return;
        }
        reachable.add(typeName);
        addReachable(definitions[typeName], definitions, reachable);
    } else if (definition.anyOf) {
        for (const def of definition.anyOf) {
            addReachable(def, definitions, reachable);
        }
    } else if (definition.allOf) {
        for (const def of definition.allOf) {
            addReachable(def, definitions, reachable);
        }
    } else if (definition.oneOf) {
        for (const def of definition.oneOf) {
            addReachable(def, definitions, reachable);
        }
    } else if (definition.not) {
        addReachable(definition.not, definitions, reachable);
    } else if (definition.type === "object") {
        for (const prop in definition.properties || {}) {
            const propDefinition = definition.properties![prop];
            addReachable(propDefinition, definitions, reachable);
        }

        const additionalProperties = definition.additionalProperties;
        if (additionalProperties) {
            addReachable(additionalProperties, definitions, reachable);
        }
    } else if (definition.type === "array") {
        const items = definition.items;
        if (isArray(items)) {
            for (const item of items) {
                addReachable(item, definitions, reachable);
            }
        } else if (items) {
            addReachable(items, definitions, reachable);
        }
    }
}

export function removeUnreachable(
    rootTypeDefinition: Definition | undefined,
    definitions: StringMap<Definition>
): StringMap<JSONSchema7> {
    if (!rootTypeDefinition) {
        return definitions;
    }

    const reachable = new Set<string>();

    addReachable(rootTypeDefinition, definitions, reachable);

    const out: StringMap<Definition> = {};

    for (const def of reachable) {
        out[def] = definitions[def];
    }

    return out;
}
