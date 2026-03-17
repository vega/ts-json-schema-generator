"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceCircularRefs = replaceCircularRefs;
exports.deepCloneDefinition = deepCloneDefinition;
exports.buildNameMaps = buildNameMaps;
/**
 * Build lookup maps from definition objects/arrays to their definition names.
 * An object matches a named definition if:
 *  - it IS the definition object itself, or
 *  - it shares the same `anyOf`/`oneOf` array reference as a named definition.
 */
function buildNameMaps(definitions) {
    const objToName = new Map();
    const arrayToName = new Map();
    for (const [name, def] of Object.entries(definitions)) {
        objToName.set(def, name);
        if (def.anyOf)
            arrayToName.set(def.anyOf, name);
        if (def.oneOf)
            arrayToName.set(def.oneOf, name);
    }
    return { objToName, arrayToName };
}
function resolveRefName(val, objToName, arrayToName) {
    const direct = objToName.get(val) ?? arrayToName.get(val);
    if (direct)
        return direct;
    const rec = val;
    if (rec.anyOf && typeof rec.anyOf === "object") {
        const name = arrayToName.get(rec.anyOf);
        if (name)
            return name;
    }
    if (rec.oneOf && typeof rec.oneOf === "object") {
        const name = arrayToName.get(rec.oneOf);
        if (name)
            return name;
    }
    return undefined;
}
/**
 * Walk the schema definitions and replace circular JS object references with JSON Schema `$ref` pointers.
 *
 * After recomputation with shallow copies, the cached definitions may contain circular JS object references
 * (e.g. Node -> anyOf[0] -> children.items -> AliasType def whose anyOf IS the same array as Node.anyOf).
 * These cycles must be replaced with `$ref` before the schema can be serialised.
 */
function replaceCircularRefs(definitions, rootDefs) {
    const { objToName, arrayToName } = buildNameMaps(definitions);
    for (const def of Object.values(definitions)) {
        walkAndReplace(def, objToName, arrayToName, new WeakSet());
    }
    if (rootDefs) {
        for (const rd of rootDefs) {
            walkAndReplace(rd, objToName, arrayToName, new WeakSet());
        }
    }
}
function walkAndReplace(obj, objToName, arrayToName, ancestors) {
    ancestors.add(obj);
    for (const key of Object.keys(obj)) {
        const val = obj[key];
        if (typeof val !== "object" || val === null)
            continue;
        if (ancestors.has(val)) {
            const name = resolveRefName(val, objToName, arrayToName);
            if (name) {
                obj[key] = { $ref: `#/definitions/${name}` };
            }
            continue;
        }
        if (Array.isArray(val)) {
            ancestors.add(val);
            for (let i = 0; i < val.length; i++) {
                const item = val[i];
                if (typeof item !== "object" || item === null)
                    continue;
                if (ancestors.has(item)) {
                    const name = resolveRefName(item, objToName, arrayToName);
                    if (name)
                        val[i] = { $ref: `#/definitions/${name}` };
                    continue;
                }
                walkAndReplace(item, objToName, arrayToName, ancestors);
            }
            ancestors.delete(val);
            continue;
        }
        walkAndReplace(val, objToName, arrayToName, ancestors);
    }
    ancestors.delete(obj);
}
/**
 * Deep-clone a schema definition, replacing any circular JS object references with JSON Schema `$ref` pointers.
 * This produces an independent, acyclic copy safe for `JSON.stringify`.
 */
function deepCloneDefinition(def, objToName, arrayToName) {
    return cloneValue(def, objToName, arrayToName, new WeakSet());
}
function cloneValue(val, objToName, arrayToName, ancestors) {
    if (typeof val !== "object" || val === null)
        return val;
    if (ancestors.has(val)) {
        const name = resolveRefName(val, objToName, arrayToName);
        if (name)
            return { $ref: `#/definitions/${name}` };
        // unmapped circular objects are replaced with {} in the clone
        return {};
    }
    ancestors.add(val);
    let result;
    if (Array.isArray(val)) {
        result = val.map((item) => cloneValue(item, objToName, arrayToName, ancestors));
    }
    else {
        const obj = val;
        const clone = {};
        for (const key of Object.keys(obj)) {
            clone[key] = cloneValue(obj[key], objToName, arrayToName, ancestors);
        }
        result = clone;
    }
    ancestors.delete(val);
    return result;
}
//# sourceMappingURL=replaceCircularRefs.js.map