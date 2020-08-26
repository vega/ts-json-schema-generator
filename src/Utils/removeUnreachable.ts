import { isArray, isBoolean } from "util";
import { Definition } from "../Schema/Definition";
import { StringMap } from "./StringMap";

function addReachable(definition: Definition | boolean, definitions: StringMap<Definition>, reachable: Set<string>) {
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
        if (definitions[typeName]) {
            addReachable(definitions[typeName], definitions, reachable);
        } else {
            throw new Error(`Definition name "${typeName}" not found`);
        }
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
    } else if (definition.type === "promise") {
        if (definition.return) {
            addReachable(definition.return, definitions, reachable);
        }
    } else if (definition.type === "function") {
        for (const arg in definition.arguments || {}) {
            const argDefinition = definition.arguments![arg];
            addReachable(argDefinition, definitions, reachable);
        }

        if (definition.return) {
            addReachable(definition.return, definitions, reachable);
        }
    } else if (definition.type === "UI.Component") {
        if (definition.props) {
            addReachable(definition.props, definitions, reachable);
        }
    }
}

export function removeUnreachable(
    rootTypeDefinition: Definition | undefined,
    definitions: StringMap<Definition>
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
