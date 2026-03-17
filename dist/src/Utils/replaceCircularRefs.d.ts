import type { Definition } from "../Schema/Definition.js";
import type { StringMap } from "./StringMap.js";
/**
 * Build lookup maps from definition objects/arrays to their definition names.
 * An object matches a named definition if:
 *  - it IS the definition object itself, or
 *  - it shares the same `anyOf`/`oneOf` array reference as a named definition.
 */
declare function buildNameMaps(definitions: StringMap<Definition>): {
    objToName: Map<object, string>;
    arrayToName: Map<object, string>;
};
/**
 * Walk the schema definitions and replace circular JS object references with JSON Schema `$ref` pointers.
 *
 * After recomputation with shallow copies, the cached definitions may contain circular JS object references
 * (e.g. Node -> anyOf[0] -> children.items -> AliasType def whose anyOf IS the same array as Node.anyOf).
 * These cycles must be replaced with `$ref` before the schema can be serialised.
 */
export declare function replaceCircularRefs(definitions: StringMap<Definition>, rootDefs?: Definition[]): void;
/**
 * Deep-clone a schema definition, replacing any circular JS object references with JSON Schema `$ref` pointers.
 * This produces an independent, acyclic copy safe for `JSON.stringify`.
 */
export declare function deepCloneDefinition(def: Definition, objToName: Map<object, string>, arrayToName: Map<object, string>): Definition;
export { buildNameMaps };
