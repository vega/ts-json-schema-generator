import { AnyType } from "../Type/AnyType";
import { ArrayType } from "../Type/ArrayType";
import { BaseType } from "../Type/BaseType";
import { EnumType } from "../Type/EnumType";
import { IntersectionType } from "../Type/IntersectionType";
import { NullType } from "../Type/NullType";
import { ObjectProperty, ObjectType } from "../Type/ObjectType";
import { OptionalType } from "../Type/OptionalType";
import { TupleType } from "../Type/TupleType";
import { UndefinedType } from "../Type/UndefinedType";
import { UnionType } from "../Type/UnionType";
import { UnknownType } from "../Type/UnknownType";
import { VoidType } from "../Type/VoidType";
import { derefType } from "./derefType";
import { LiteralType, LiteralValue } from "../Type/LiteralType";
import { StringType } from "../Type/StringType";
import { NumberType } from "../Type/NumberType";
import { BooleanType } from "../Type/BooleanType";
import { InferType } from "../Type/InferType";
import { RestType } from "../Type/RestType";
import { NeverType } from "../Type/NeverType";

/**
 * Returns the combined types from the given intersection. Currently only object types are combined. Maybe more
 * types needs to be combined to properly support complex intersections.
 *
 * @param intersection - The intersection type to combine.
 * @return The combined types within the intersection.
 */
function combineIntersectingTypes(intersection: IntersectionType): BaseType[] {
    const objectTypes: ObjectType[] = [];
    const combined = intersection.getTypes().filter((type) => {
        if (type instanceof ObjectType) {
            objectTypes.push(type);
        } else {
            return true;
        }
        return false;
    });
    if (objectTypes.length === 1) {
        combined.push(objectTypes[0]);
    } else if (objectTypes.length > 1) {
        combined.push(new ObjectType(`combined-objects-${intersection.getId()}`, objectTypes, [], false));
    }
    return combined;
}

/**
 * Returns all object properties of the given type and all its base types.
 *
 * @param type - The type for which to return the properties. If type is not an object type or object has no properties
 *               Then an empty list ist returned.
 * @return All object properties of the type. Empty if none.
 */
function getObjectProperties(type: BaseType): ObjectProperty[] {
    type = derefType(type)!;
    const properties = [];
    if (type instanceof ObjectType) {
        properties.push(...type.getProperties());
        for (const baseType of type.getBaseTypes()) {
            properties.push(...getObjectProperties(baseType));
        }
    }
    return properties;
}

function getPrimitiveType(value: LiteralValue) {
    switch (typeof value) {
        case "string":
            return new StringType();
        case "number":
            return new NumberType();
        case "boolean":
            return new BooleanType();
    }
}

/**
 * Checks if given source type is assignable to given target type.
 *
 * The logic of this function is heavily inspired by
 * https://github.com/runem/ts-simple-type/blob/master/src/is-assignable-to-simple-type.ts
 *
 * @param source      - The source type.
 * @param target      - The target type.
 * @param inferMap    - Optional parameter that keeps track of the inferred types.
 * @param insideTypes - Optional parameter used internally to solve circular dependencies.
 * @return True if source type is assignable to target type.
 */
export function isAssignableTo(
    target: BaseType,
    source: BaseType,
    inferMap: Map<string, BaseType> = new Map(),
    insideTypes: Set<BaseType> = new Set()
): boolean {
    // Dereference source and target
    source = derefType(source);
    target = derefType(target);

    // Type "never" can be assigned to anything
    if (source instanceof NeverType) {
        return true;
    }

    // Nothing can be assigned to "never"
    if (target instanceof NeverType) {
        return false;
    }

    // Infer type can become anything
    if (target instanceof InferType) {
        const key = target.getName();
        const infer = inferMap.get(key);

        if (infer === undefined) {
            inferMap.set(key, source);
        } else {
            inferMap.set(key, new UnionType([infer, source]));
        }

        return true;
    }

    // Check for simple type equality
    if (source.getId() === target.getId()) {
        return true;
    }

    /** Don't check types when already inside them. This solves circular dependencies. */
    if (insideTypes.has(source) || insideTypes.has(target)) {
        return true;
    }

    // Assigning from or to any-type is always possible
    if (source instanceof AnyType || target instanceof AnyType) {
        return true;
    }

    // assigning to unknown type is always possible
    if (target instanceof UnknownType) {
        return true;
    }

    // 'null', or 'undefined' can be assigned to the void
    if (target instanceof VoidType) {
        return source instanceof NullType || source instanceof UndefinedType;
    }

    // Union and enum type is assignable to target when all types in the union/enum are assignable to it
    if (source instanceof UnionType || source instanceof EnumType) {
        return source.getTypes().every((type) => isAssignableTo(target, type, inferMap, insideTypes));
    }

    // When source is an intersection type then it can be assigned to target if any of the sub types matches. Object
    // types within the intersection must be combined first
    if (source instanceof IntersectionType) {
        return combineIntersectingTypes(source).some((type) => isAssignableTo(target, type, inferMap, insideTypes));
    }

    // For arrays check if item types are assignable
    if (target instanceof ArrayType) {
        const targetItemType = target.getItem();
        if (source instanceof ArrayType) {
            return isAssignableTo(targetItemType, source.getItem(), inferMap, insideTypes);
        } else if (source instanceof TupleType) {
            return isAssignableTo(targetItemType, new UnionType(source.getTypes()), inferMap, insideTypes);
        } else {
            return false;
        }
    }

    // When target is a union or enum type then check if source type can be assigned to any variant
    if (target instanceof UnionType || target instanceof EnumType) {
        return target.getTypes().some((type) => isAssignableTo(type, source, inferMap, insideTypes));
    }

    // When target is an intersection type then source can be assigned to it if it matches all sub types. Object
    // types within the intersection must be combined first
    if (target instanceof IntersectionType) {
        return combineIntersectingTypes(target).every((type) => isAssignableTo(type, source, inferMap, insideTypes));
    }

    // Check literal types
    if (source instanceof LiteralType) {
        return isAssignableTo(target, getPrimitiveType(source.getValue()), inferMap);
    }

    if (target instanceof ObjectType) {
        // primitives are not assignable to `object`
        if (
            target.getNonPrimitive() &&
            (source instanceof NumberType || source instanceof StringType || source instanceof BooleanType)
        ) {
            return false;
        }

        const targetMembers = getObjectProperties(target);
        if (targetMembers.length === 0) {
            // When target object is empty then anything except null and undefined can be assigned to it
            return !isAssignableTo(new UnionType([new UndefinedType(), new NullType()]), source, inferMap, insideTypes);
        } else if (source instanceof ObjectType) {
            const sourceMembers = getObjectProperties(source);

            // Check if target has properties in common with source
            const inCommon = targetMembers.some((targetMember) =>
                sourceMembers.some((sourceMember) => targetMember.getName() === sourceMember.getName())
            );

            return (
                targetMembers.every((targetMember) => {
                    // Make sure that every required property in target type is present
                    const sourceMember = sourceMembers.find((member) => targetMember.getName() === member.getName());
                    return sourceMember == null ? inCommon && !targetMember.isRequired() : true;
                }) &&
                sourceMembers.every((sourceMember) => {
                    const targetMember = targetMembers.find((member) => member.getName() === sourceMember.getName());
                    if (targetMember == null) {
                        return true;
                    }
                    return isAssignableTo(
                        targetMember.getType(),
                        sourceMember.getType(),
                        inferMap,
                        new Set(insideTypes).add(source).add(target)
                    );
                })
            );
        }

        const isArrayLikeType = source instanceof ArrayType || source instanceof TupleType;
        if (isArrayLikeType) {
            const lengthPropType = targetMembers
                .find((prop) => prop.getName() === "length" && prop.isRequired())
                ?.getType();

            if (source instanceof ArrayType) {
                return lengthPropType instanceof NumberType;
            }

            if (source instanceof TupleType) {
                if (lengthPropType instanceof LiteralType) {
                    const types = source.getTypes();
                    const lengthPropValue = lengthPropType.getValue();
                    return types.length === lengthPropValue;
                }
            }
        }
    }

    // Check if tuple types are compatible
    if (target instanceof TupleType) {
        if (source instanceof TupleType) {
            const sourceMembers = source.getTypes();
            const targetMembers = target.getTypes();

            // TODO: Currently, the final element of the target tuple may be a
            // rest type. However, since TypeScript 4.0, a tuple may contain
            // multiple rest types at arbitrary locations.
            return targetMembers.every((targetMember, i) => {
                const numTarget = targetMembers.length;
                const numSource = sourceMembers.length;

                if (i == numTarget - 1) {
                    if (numTarget <= numSource + 1) {
                        if (targetMember instanceof RestType) {
                            const remaining: Array<BaseType> = [];
                            for (let j = i; j < numSource; j++) {
                                remaining.push(sourceMembers[j]);
                            }
                            return isAssignableTo(
                                targetMember.getType(),
                                new TupleType(remaining),
                                inferMap,
                                insideTypes
                            );
                        }
                        // The type cannot be assigned if more than one source
                        // member is remaining and the final target type is not
                        // a rest type.
                        else if (numTarget < numSource) {
                            return false;
                        }
                    }
                }

                const sourceMember = sourceMembers[i];
                if (targetMember instanceof OptionalType) {
                    if (sourceMember) {
                        return (
                            isAssignableTo(targetMember, sourceMember, inferMap, insideTypes) ||
                            isAssignableTo(targetMember.getType(), sourceMember, inferMap, insideTypes)
                        );
                    } else {
                        return true;
                    }
                } else {
                    if (sourceMember === undefined) {
                        return false;
                    }
                    return isAssignableTo(targetMember, sourceMember, inferMap, insideTypes);
                }
            });
        }
    }

    return false;
}
