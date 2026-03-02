import type { Definition } from "../Schema/Definition.js";
import type { StringMap } from "./StringMap.js";

type AnyObj = Record<string, unknown>;

/**
 * Build lookup maps from definition objects/arrays to their definition names.
 * An object matches a named definition if:
 *  - it IS the definition object itself, or
 *  - it shares the same `anyOf`/`oneOf` array reference as a named definition.
 */
function buildNameMaps(definitions: StringMap<Definition>): {
    objToName: Map<object, string>;
    arrayToName: Map<object, string>;
} {
    const objToName = new Map<object, string>();
    const arrayToName = new Map<object, string>();

    for (const [name, def] of Object.entries(definitions)) {
        objToName.set(def as AnyObj, name);
        if (def.anyOf) arrayToName.set(def.anyOf as unknown as object, name);
        if (def.oneOf) arrayToName.set(def.oneOf as unknown as object, name);
    }

    return { objToName, arrayToName };
}

function resolveRefName(
    val: object,
    objToName: Map<object, string>,
    arrayToName: Map<object, string>,
): string | undefined {
    const direct = objToName.get(val) ?? arrayToName.get(val);
    if (direct) return direct;
    const rec = val as AnyObj;
    if (rec.anyOf && typeof rec.anyOf === "object") {
        const name = arrayToName.get(rec.anyOf);
        if (name) return name;
    }
    if (rec.oneOf && typeof rec.oneOf === "object") {
        const name = arrayToName.get(rec.oneOf);
        if (name) return name;
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
export function replaceCircularRefs(definitions: StringMap<Definition>, rootDefs?: Definition[]): void {
    const { objToName, arrayToName } = buildNameMaps(definitions);

    for (const def of Object.values(definitions)) {
        walkAndReplace(def as AnyObj, objToName, arrayToName, new WeakSet());
    }

    if (rootDefs) {
        for (const rd of rootDefs) {
            walkAndReplace(rd as AnyObj, objToName, arrayToName, new WeakSet());
        }
    }
}

function walkAndReplace(
    obj: AnyObj,
    objToName: Map<object, string>,
    arrayToName: Map<object, string>,
    ancestors: WeakSet<object>,
): void {
    ancestors.add(obj);

    for (const key of Object.keys(obj)) {
        const val = obj[key];
        if (typeof val !== "object" || val === null) continue;

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
                const item = val[i] as unknown;
                if (typeof item !== "object" || item === null) continue;

                if (ancestors.has(item)) {
                    const name = resolveRefName(item, objToName, arrayToName);
                    if (name) val[i] = { $ref: `#/definitions/${name}` };
                    continue;
                }

                walkAndReplace(item as AnyObj, objToName, arrayToName, ancestors);
            }
            ancestors.delete(val);
            continue;
        }

        walkAndReplace(val as AnyObj, objToName, arrayToName, ancestors);
    }

    ancestors.delete(obj);
}

/**
 * Deep-clone a schema definition, replacing any circular JS object references with JSON Schema `$ref` pointers.
 * This produces an independent, acyclic copy safe for `JSON.stringify`.
 */
export function deepCloneDefinition(
    def: Definition,
    objToName: Map<object, string>,
    arrayToName: Map<object, string>,
): Definition {
    return cloneValue(def, objToName, arrayToName, new WeakSet()) as Definition;
}

function cloneValue(
    val: unknown,
    objToName: Map<object, string>,
    arrayToName: Map<object, string>,
    ancestors: WeakSet<object>,
): unknown {
    if (typeof val !== "object" || val === null) return val;

    if (ancestors.has(val)) {
        const name = resolveRefName(val, objToName, arrayToName);
        if (name) return { $ref: `#/definitions/${name}` };
        // unmapped circular objects are replaced with {} in the clone
        return {};
    }

    ancestors.add(val);

    let result: unknown;
    if (Array.isArray(val)) {
        result = val.map((item) => cloneValue(item, objToName, arrayToName, ancestors));
    } else {
        const obj = val as AnyObj;
        const clone: AnyObj = {};
        for (const key of Object.keys(obj)) {
            clone[key] = cloneValue(obj[key], objToName, arrayToName, ancestors);
        }
        result = clone;
    }

    ancestors.delete(val);
    return result;
}

export { buildNameMaps };
