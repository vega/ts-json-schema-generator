import { AliasType } from "../Type/AliasType";
import { AnnotatedType } from "../Type/AnnotatedType";
import { ArrayType } from "../Type/ArrayType";
import { BaseType } from "../Type/BaseType";
import { BooleanType } from "../Type/BooleanType";
import { DefinitionType } from "../Type/DefinitionType";
import { EnumType } from "../Type/EnumType";
import { IntersectionType } from "../Type/IntersectionType";
import { LiteralType } from "../Type/LiteralType";
import { NullType } from "../Type/NullType";
import { NumberType } from "../Type/NumberType";
import { ObjectType } from "../Type/ObjectType";
import { OptionalType } from "../Type/OptionalType";
import { ReferenceType } from "../Type/ReferenceType";
import { RestType } from "../Type/RestType";
import { StringType } from "../Type/StringType";
import { SymbolType } from "../Type/SymbolType";
import { TupleType } from "../Type/TupleType";
import { UndefinedType } from "../Type/UndefinedType";
import { UnionType } from "../Type/UnionType";

export function makeExemplar(type: BaseType | undefined): unknown {
    return makeExemplars(type)[0];
}

export function makeExemplars(type: BaseType | undefined): readonly unknown[] {
    while (type) {
        if (
            type instanceof AliasType ||
            type instanceof AnnotatedType ||
            type instanceof DefinitionType ||
            type instanceof ReferenceType
        ) {
            type = type.getType();
        } else if (type instanceof ArrayType) {
            const itemExemplars = makeExemplars(type.getItem());
            return [[], itemExemplars].concat(itemExemplars.map((e) => [e, e]));
        } else if (type instanceof BooleanType) {
            return [true, false];
        } else if (type instanceof EnumType) {
            return type.getValues();
        } else if (type instanceof IntersectionType) {
            return makeIntersectionExemplars(type);
        } else if (type instanceof LiteralType) {
            return [type.getValue()];
        } else if (type instanceof NullType) {
            return [null];
        } else if (type instanceof NumberType) {
            return [0, 1, -1];
        } else if (type instanceof ObjectType) {
            return makeObjectExemplars(type);
        } else if (type instanceof OptionalType) {
            return makeExemplars(type.getType()).concat([undefined]);
        } else if (type instanceof RestType) {
            const exemplar = makeExemplars(type.getType());
            return [[], [exemplar], [exemplar, exemplar]];
        } else if (type instanceof StringType) {
            return ["", "lorem ipsum"];
        } else if (type instanceof SymbolType) {
            return [Symbol(), Symbol()];
        } else if (type instanceof TupleType) {
            return makeTupleExemplars(type);
        } else if (type instanceof UndefinedType) {
            return [undefined];
        } else if (type instanceof UnionType) {
            return type
                .getTypes()
                .map((t) => makeExemplars(t))
                .reduce((list, choice) => list.concat(choice), []);
        } else {
            throw new Error(`Can't make exemplar from type ${type.constructor.name}: ${type}`);
        }
    }
    return [undefined];
}

type UnknownObject = Record<string, unknown>;

function makeIntersectionExemplars(type: IntersectionType): unknown[] {
    const warnings: string[] = [];
    function intersectExemplars(
        exemplars: (readonly unknown[])[],
        currentResult: unknown,
        members: UnknownObject[]
    ): unknown[] {
        for (let i = 0; i < exemplars.length; i++) {
            const choices = exemplars[i];
            if (choices.length > 1) {
                return choices
                    .map((choice) => {
                        const subExemplars = exemplars.slice(i); // including the one with the multiple-choice element
                        subExemplars[0] = [choice]; // ...and overwriting it with a single choice
                        const subMembers = members.slice();
                        return intersectExemplars(subExemplars, currentResult, subMembers);
                    })
                    .reduce((list, choice) => list.concat(choice), []);
            } else if (choices.length === 0) {
                return [];
            }
            const exemplar = choices[0];
            if (exemplar == null) {
                warnings.push(`Can't make exemplar from intersection with null/undefined`);
                return [];
            } else if (exemplar && typeof exemplar === "object" && !Array.isArray(exemplar)) {
                members.push(exemplar as UnknownObject);
            } else {
                // We can only have one non-object member. It will become the base we add all the others to.
                if (currentResult !== undefined && exemplar !== currentResult) {
                    warnings.push(`Can't make exemplar from complex intersection`);
                    return [];
                } else {
                    currentResult = exemplar;
                }
            }
        }

        // We've gotten here, which means we have exactly one choice at this level of recursion.
        // Now we just need to merge the intersection members.

        if (members.length === 0) {
            // no properties to add, just return the base value
            return [currentResult];
        }
        let result: UnknownObject;
        if (currentResult === undefined) {
            result = {};
        } else if (typeof currentResult !== "object") {
            // for primitive values, box them to allow adding properties
            result = new (currentResult as any).constructor(currentResult);
        } else if (Array.isArray(currentResult)) {
            result = currentResult.slice() as any;
        } else {
            result = Object.assign({}, currentResult);
        }

        const collisions: Record<string, unknown[]> = {};

        for (const member of members) {
            for (const [key, value] of Object.entries(member)) {
                if (Object.getOwnPropertyDescriptor(result, key)) {
                    if (!(key in collisions)) {
                        collisions[key] = [result[key]];
                    }
                    collisions[key].push(value);
                } else {
                    result[key] = value;
                }
            }
        }

        return resolveObjectChoices(result, Object.entries(collisions));
    }

    const choices = intersectExemplars(
        type.getTypes().map((t) => makeExemplars(t)),
        undefined,
        []
    );
    if (choices.length === 0) {
        throw new Error(`Could not make intersection; warnings=${JSON.stringify(warnings)}`);
    }
    return choices;
}

function resolveObjectChoices(exemplar: UnknownObject, choiceEntries: [string, readonly unknown[]][]): UnknownObject[] {
    if (choiceEntries.length === 0) {
        return [exemplar];
    }
    const [prop, choices] = choiceEntries[0];
    const results: UnknownObject[] = [];
    for (const choice of choices) {
        const newExemplar = new (exemplar.constructor as new (val: UnknownObject) => UnknownObject)(exemplar);
        newExemplar[prop] = choice;
        results.push(...resolveObjectChoices(exemplar, choiceEntries.slice(1)));
    }
    return results;
}

function makeObjectExemplars(type: ObjectType): readonly unknown[] {
    const fullObject: UnknownObject = {};
    const emptyObject: UnknownObject = {};
    const choices: [string, readonly unknown[]][] = [];
    let hasOptional = false;
    for (const prop of type.getProperties()) {
        const name = prop.getName();
        const values = makeExemplars(prop.getType());
        if (values.length === 0) {
            throw new Error(`Cannot make object exemplar with invalid property for type ${type}`);
        } else if (values.length > 1) {
            choices.push([name, values]);
        }
        const value = values[0];
        fullObject[name] = value;
        if (prop.isRequired()) {
            emptyObject[name] = value;
        } else {
            hasOptional = true;
        }
    }
    const additional = type.getAdditionalProperties();
    if (additional === true) {
        hasOptional = true;
        fullObject["<UNLIKELY PROPERTY>"] = "UNLIKELY VALUE";
    } else if (additional) {
        hasOptional = true;
        choices.push(["<UNLIKELY PROPERTY>", makeExemplars(additional)]);
    }
    const allChoices = resolveObjectChoices(fullObject, choices);
    if (hasOptional) {
        allChoices.push(emptyObject);
    }
    return allChoices;
}

function makeTupleExemplars(type: TupleType): readonly unknown[] {
    const exemplars = type.getTypes().map((t) => makeExemplars(t));
    function makeTuples(prefix: readonly unknown[], items: (readonly unknown[])[]): (readonly unknown[])[] {
        if (items.length === 0) {
            return [prefix];
        }
        const [head, ...tail] = items;
        const results: (readonly unknown[])[] = [];
        for (const choice of head) {
            results.push(...makeTuples(prefix.concat([choice]), tail));
        }
        return results;
    }

    return makeTuples([], exemplars);
}
