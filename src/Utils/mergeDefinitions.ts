import { Definition } from "../Schema/Definition";

/**
 * Attempt to merge two disjoint definitions into one. Definitions are disjoint
 * (and therefore mergeable) if all of the following are true:
 * 1) Each has a 'type' property, and they share no types in common,
 * 2) The cross-type validation properties 'enum' and 'const' are not on either definition, and
 * 3) The two definitions have no properties besides 'type' in common.
 *
 * OR, if the following are true:
 * 1) Each has an 'enum' or 'const' property (which is treated as an enum with one element)
 * 2) They both have a 'type' property (which will be merged and deduplicated) or both do not
 * 3) They share no other properties besides, possibly, 'type'
 * Returns the merged definition, or null if the two defs were not disjoint.
 */
export function mergeDefinitions(def1: Definition, def2: Definition): Definition | null {
    if (def1.$ref || def2.$ref) {
        // pointer definitions are never mergeable
        return null;
    }
    const { type: type1, enum: enum1, props: props1 } = splitTypesAndEnums(def1);
    const { type: type2, enum: enum2, props: props2 } = splitTypesAndEnums(def2);
    const result: Definition = {
        ...props1,
        ...props2,
    };

    if (Object.keys(result).length !== Object.keys(props1).length + Object.keys(props2).length) {
        // shared properties - unmergeable
        return null;
    }

    if (enum1 && enum2) {
        if (type1 && type2) {
            result.type = Array.from(new Set(type1.concat(type2)));
        } else if (type1 || type2) {
            // one is typed and one isn't - unmergeable
            return null;
        }
        result.enum = Array.from(new Set(enum1.concat(enum2)));
    } else if (type1 && type2 && !enum1 && !enum2) {
        if (type1.some((t) => type2.includes(t))) {
            // shared types - unmergeable
            return null;
        }
        result.type = type1.concat(type2);
    } else {
        return null;
    }

    return result;
}

function splitTypesAndEnums(def: Definition) {
    const { type: _type, const: _const, enum: _enum, ...props } = def;
    return {
        type: typeof _type === "string" ? [_type] : _type,
        enum: typeof _const !== "undefined" ? [_const] : _enum,
        props,
    };
}
