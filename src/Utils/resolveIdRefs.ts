import { JSONSchema7Definition } from "json-schema";
import { StringMap } from "./StringMap";

/**
 * Resolve all `#/definitions/...` and `$ref` in schema with appropriate disambiguated names
 */
export function resolveIdRefs(
    schema: JSONSchema7Definition,
    idNameMap: Map<string, string>,
    encodeRefs: boolean
): JSONSchema7Definition {
    if (!schema || typeof schema === "boolean") {
        return schema;
    }
    const { $ref, allOf, oneOf, anyOf, not, properties, items, definitions, additionalProperties, ...rest } = schema;
    const result: JSONSchema7Definition = { ...rest };
    if ($ref) {
        // THE Money Shot.
        const id = encodeRefs ? decodeURIComponent($ref.slice(14)) : $ref.slice(14);
        const name = idNameMap.get(id);
        result.$ref = `#/definitions/${encodeRefs ? encodeURIComponent(name!) : name}`;
    }
    if (definitions) {
        result.definitions = Object.entries(definitions).reduce((acc, [prop, value]) => {
            const name = idNameMap.get(prop)!;
            acc[name] = resolveIdRefs(value, idNameMap, encodeRefs);
            return acc;
        }, {} as StringMap<JSONSchema7Definition>);
    }
    if (properties) {
        result.properties = Object.entries(properties).reduce((acc, [prop, value]) => {
            acc[prop] = resolveIdRefs(value, idNameMap, encodeRefs);
            return acc;
        }, {} as StringMap<JSONSchema7Definition>);
    }
    if (additionalProperties || additionalProperties === false) {
        result.additionalProperties = resolveIdRefs(additionalProperties, idNameMap, encodeRefs);
    }
    if (items) {
        result.items = Array.isArray(items)
            ? items.map((el) => resolveIdRefs(el, idNameMap, encodeRefs))
            : resolveIdRefs(items, idNameMap, encodeRefs);
    }
    if (allOf) {
        result.allOf = allOf.map((el) => resolveIdRefs(el, idNameMap, encodeRefs));
    }
    if (anyOf) {
        result.anyOf = anyOf.map((el) => resolveIdRefs(el, idNameMap, encodeRefs));
    }
    if (oneOf) {
        result.oneOf = oneOf.map((el) => resolveIdRefs(el, idNameMap, encodeRefs));
    }
    if (not) {
        result.not = resolveIdRefs(not, idNameMap, encodeRefs);
    }
    return result;
}
