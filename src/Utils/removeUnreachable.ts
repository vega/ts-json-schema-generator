import { JSONSchema7Definition } from "json-schema";
import { Definition } from "../Schema/Definition.js";
import { StringMap } from "./StringMap.js";

const DEFINITION_OFFSET = "#/definitions/".length;

function addReachable(
    definition: Definition | JSONSchema7Definition,
    definitions: StringMap<Definition>,
    reachable: Set<string>,
) {
    if (typeof definition === "boolean") {
        return;
    }

    if (definition.$ref) {
        const typeName = decodeURIComponent(definition.$ref.slice(DEFINITION_OFFSET));
        if (reachable.has(typeName) || !isLocalRef(definition.$ref)) {
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
    } else if (definition.type?.includes("object")) {
        for (const prop in definition.properties || {}) {
            const propDefinition = definition.properties![prop];
            addReachable(propDefinition, definitions, reachable);
        }

        const additionalProperties = definition.additionalProperties;
        if (additionalProperties) {
            addReachable(additionalProperties, definitions, reachable);
        }
    } else if (definition.type?.includes("array")) {
        const items = definition.items;
        if (Array.isArray(items)) {
            for (const item of items) {
                addReachable(item, definitions, reachable);
            }
        } else if (items) {
            addReachable(items, definitions, reachable);
        }
    } else if (definition.then) {
        addReachable(definition.then, definitions, reachable);
    }
}

export function removeUnreachable(
    rootTypeDefinition: Definition | undefined,
    definitions: StringMap<Definition>,
): StringMap<Definition> {
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

function isLocalRef(ref: string) {
    return ref.charAt(0) === "#";
}
