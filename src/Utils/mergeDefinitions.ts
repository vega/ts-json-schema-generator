import { Definition } from "../Schema/Definition";
import { RawTypeName } from "../Schema/RawType";

const isIntegerKey = "\0isInteger";
type _Definition = Definition & { [isIntegerKey]?: true };
type DefinitionProp = keyof _Definition;

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
    const result: _Definition = {};

    const def1Validations: Partial<Record<RawTypeName, _Definition>> = {};
    const def2Validations: Partial<Record<RawTypeName, _Definition>> = {};
    for (const [props, validations] of [
        [props1, def1Validations],
        [props2, def2Validations],
    ] as const) {
        for (const prop of Object.keys(props) as DefinitionProp[]) {
            const value = props[prop];
            const propValidationType = propertyValidationMap[prop];
            if (!propValidationType) {
                // assume this is a general validation property, bail
                return null;
            }
            if (prop in result && value !== result[prop]) {
                // shared annotation without identical values, unmergeable
                return null;
            }
            if (typeof propValidationType === "string") {
                validations[propValidationType] ??= {};
                // Typescript gets sad about how many properties there are.
                (validations[propValidationType] as any)[prop] = value;
            } else {
                (result as any)[prop] = value;
            }
        }
    }

    if (enum1 && enum2) {
        if (type1 && type2) {
            result.type = Array.from(new Set(type1.concat(type2)));
        } else if (type1 || type2) {
            // one is typed and one isn't - unmergeable
            return null;
        }
        result.enum = Array.from(new Set(enum1.concat(enum2)));
    } else if (
        enum1 &&
        !enum2 &&
        type1?.every((t) => type2?.includes(t) && !def1Validations[t] && !def2Validations[t])
    ) {
        // enum vs non-enum - can be collapsed if the non-enum shares type and there are no validations
        result.type = type2;
    } else if (
        enum2 &&
        !enum1 &&
        type2?.every((t) => type1?.includes(t) && !def1Validations[t] && !def2Validations[t])
    ) {
        result.type = type1;
    } else if (type1 && type2 && !enum1 && !enum2) {
        const allTypes = Array.from(new Set(type1.concat(type2)));
        // Check every type represented in either def. Possibilities are:
        // 1) Included in only one def. Include validations from that def.
        // 2) Included in both defs, with validations in only one. Include without validations.
        // 3) Included in both defs, validations in one are a strict subset of the other. Include the less-constrained.
        // 4) Incompatible validations. Bail.
        for (const type of allTypes) {
            const typeValidations1 = def1Validations[type];
            const typeValidations2 = def2Validations[type];
            let useValidations: _Definition | undefined;
            if (!type1.includes(type)) {
                useValidations = typeValidations2;
            } else if (!type2.includes(type)) {
                useValidations = typeValidations1;
            } else if (!typeValidations1 || !typeValidations2) {
                // No validations, since we know both defs have the type
            } else if (
                Object.entries(typeValidations1).every(([k, v]) => typeValidations2[k as DefinitionProp] === v)
            ) {
                // typeValidations1 is a strict subset of typeValidations2
                useValidations = typeValidations1;
            } else if (
                Object.entries(typeValidations2).every(([k, v]) => typeValidations1[k as DefinitionProp] === v)
            ) {
                // typeValidations2 is a strict subset of typeValidations1
                useValidations = typeValidations2;
            } else {
                // incompatible validations for this type
                return null;
            }
            if (useValidations) {
                Object.assign(result, useValidations);
            }
        }
        result.type = allTypes;
    } else {
        return null;
    }

    if (result[isIntegerKey]) {
        if (Array.isArray(result.type) && result.type.includes("number")) {
            result.type[result.type.indexOf("number")] = "integer";
        }
        delete result[isIntegerKey];
    }

    if (Array.isArray(result.type) && result.type.length === 1) {
        result.type = result.type[0];
    }

    return result;
}

function splitTypesAndEnums(def: Definition) {
    const { type: _type, const: _const, enum: _enum, ...props } = def;
    const result = {
        type: typeof _type === "string" ? [_type] : _type,
        enum: typeof _const !== "undefined" ? [_const] : _enum,
        props: props as _Definition,
    };
    if (result.type?.includes("integer")) {
        // type integer is effectively a constraint on type number. Treat it as such for now.
        if (!result.type.includes("number")) {
            result.type.push("number");
        }
        result.props[isIntegerKey] = true;
    }
    return result;
}

const typeValidations: Record<RawTypeName, DefinitionProp[]> = {
    array: ["items", "additionalItems", "maxItems", "minItems", "uniqueItems", "contains"],
    boolean: [],
    integer: [],
    null: [],
    number: ["multipleOf", "maximum", "exclusiveMaximum", "minimum", "exclusiveMinimum", isIntegerKey],
    object: [
        "maxProperties",
        "minProperties",
        "required",
        "properties",
        "patternProperties",
        "additionalProperties",
        "dependencies",
        "propertyNames",
    ],
    string: ["maxLength", "minLength", "pattern"],
};

const knownAnnotations: DefinitionProp[] = [
    "title",
    "description",
    "default",
    "readOnly",
    "writeOnly",
    "examples",
    "$comment",
    "contentEncoding",
    "contentMediaType",
];

// Anything that isn't in one of the above lists is assumed to be a general validation keyword
const propertyValidationMap: Partial<Record<DefinitionProp, RawTypeName | true>> = Object.fromEntries(
    knownAnnotations
        .map((prop) => [prop, true as RawTypeName | true])
        .concat(
            ...Object.entries(typeValidations).map(([type, props]) => props.map((prop) => [prop, type as RawTypeName]))
        )
);
