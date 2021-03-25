import { Definition } from "../Schema/Definition";
import { uniqueArray } from "./uniqueArray";

/**
 * Attempt to merge two disjoint definitions into one. Definitions are disjoint
 * (and therefore mergeable) if all of the following are true:
 * 1) Each has a 'type' property, and they share no types in common,
 * 2) The cross-type validation properties 'enum' and 'const' are not on either definition, and
 * 3) The two definitions have no properties besides 'type' in common.
 *
 * Returns the merged definition, or null if the two defs were not disjoint.
 */
export function mergeDefinitions(def1: Definition, def2: Definition): Definition | null {
    const { type: type1, ...props1 } = def1;
    const { type: type2, ...props2 } = def2;
    const types = [type1!, type2!].flat();
    if (!type1 || !type2 || uniqueArray(types).length !== types.length) {
        return null;
    }
    const keys = [Object.keys(props1), Object.keys(props2)].flat();
    if (keys.includes("enum") || keys.includes("const") || uniqueArray(keys).length !== keys.length) {
        return null;
    }
    return { type: types, ...props1, ...props2 };
}
