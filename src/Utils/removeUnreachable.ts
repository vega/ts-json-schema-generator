import { JSONSchema7Definition } from "json-schema";
import { Definition } from "./../Schema/Definition";
import { StringMap } from "./StringMap";

function addReachable(
    definition: Definition | JSONSchema7Definition | undefined | Array<Definition | JSONSchema7Definition>,
    definitions: StringMap<Definition>,
    reachable: Set<string>
) {
    function addReachableProperties(properties: Record<any, Definition | JSONSchema7Definition> | undefined) {
        for (const def of Object.values(properties || {})) {
            addReachable(def, definitions, reachable);
        }
    }
    if (!definition || typeof definition !== "object") {
        return;
    }
    if (Array.isArray(definition)) {
        for (const def of definition) {
            addReachable(def, definitions, reachable);
        }
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
    } else {
        addReachable(definition.anyOf, definitions, reachable);
        addReachable(definition.allOf, definitions, reachable);
        addReachable(definition.oneOf, definitions, reachable);
        addReachable(definition.not, definitions, reachable);
        addReachable(definition.contains, definitions, reachable);

        addReachable(definition.if, definitions, reachable);
        addReachable(definition.then, definitions, reachable);
        addReachable(definition.else, definitions, reachable);

        addReachableProperties(definition.properties);
        addReachableProperties(definition.patternProperties);
        addReachable(definition.additionalProperties, definitions, reachable);

        addReachable(definition.items, definitions, reachable);
        addReachable(definition.additionalItems, definitions, reachable);
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
