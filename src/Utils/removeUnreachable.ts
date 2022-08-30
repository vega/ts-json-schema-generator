import { JSONSchema7Definition } from "json-schema";
import { Config } from "../..";
import { Definition } from "../Schema/Definition";
import { StringMap } from "./StringMap";

export const DEFINITION = "#/definitions/";
const DEFINITION_OFFSET = DEFINITION.length;

function addReachable(
    definition: Definition | JSONSchema7Definition,
    definitions: StringMap<Definition>,
    reachable: Set<string>,
    config?: Config
) {
    if (typeof definition === "boolean") {
        return;
    }

    if (definition.$ref) {
        const useDefinitions = config?.useDefinitions ?? true;

        const typeName = decodeURIComponent(
            useDefinitions ? definition.$ref.slice(DEFINITION_OFFSET) : definition.$ref
        );

        if (reachable.has(typeName) || (useDefinitions && !isLocalRef(definition.$ref))) {
            // we've already processed this definition, or this definition refers to an external schema
            return;
        }

        reachable.add(typeName);

        const refDefinition = definitions[typeName];

        if (!refDefinition) {
            throw new Error(`Encountered a reference to a missing definition: "${definition.$ref}". This is a bug.`);
        }

        addReachable(refDefinition, definitions, reachable);
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
        if (Array.isArray(items)) {
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
    definitions: StringMap<Definition>,
    config?: Config
): StringMap<Definition> {
    if (!rootTypeDefinition) {
        return definitions;
    }

    const reachable = new Set<string>();

    addReachable(rootTypeDefinition, definitions, reachable, config);

    const out: StringMap<Definition> = {};

    for (const def of reachable) {
        out[def] = definitions[def];
    }

    return out;
}

function isLocalRef(ref: string) {
    return ref.charAt(0) === "#";
}
