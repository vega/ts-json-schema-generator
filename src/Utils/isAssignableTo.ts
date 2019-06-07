import { AnyType } from "../Type/AnyType";
import { ArrayType } from "../Type/ArrayType";
import { BaseType } from "../Type/BaseType";
import { IntersectionType } from "../Type/IntersectionType";
import { NeverType } from "../Type/NeverType";
import { NullType } from "../Type/NullType";
import { ObjectProperty, ObjectType } from "../Type/ObjectType";
import { OptionalType } from "../Type/OptionalType";
import { TupleType } from "../Type/TupleType";
import { UndefinedType } from "../Type/UndefinedType";
import { UnionType } from "../Type/UnionType";
import { UnknownType } from "../Type/UnknownType";
import { derefType } from "./derefType";

/**
 * Returns the combined types from the given intersection. Currently only object types are combined. Maybe more
 * types needs to be combined to properly support complex intersections.
 *
 * @param intersection - The intersection type to combine.
 * @return The combined types within the intersection.
 */
function combineIntersectingTypes(intersection: IntersectionType): BaseType[] {
    const objectTypes: ObjectType[] = [];
    const combined = intersection.getTypes().filter(type => {
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
        combined.push(new ObjectType("combined-objects-" + intersection.getId(), objectTypes, [], false));
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
    type = derefType(type);
    const properties = [];
    if (type instanceof ObjectType) {
        properties.push(...type.getProperties());
        for (const baseType of type.getBaseTypes()) {
            properties.push(...getObjectProperties(baseType));
        }
    }
    return properties;
}

/**
 * Checks if given source type is assignable to given target type.
 *
 * @param source - The source type.
 * @param target - The target type.
 * @return True if source type is assignable to target type.
 */
export function isAssignableTo(target: BaseType, source: BaseType): boolean {
    // Dereference source and target
    source = derefType(source);
    target = derefType(target);

    // Check for simple type equality
    if (source.getId() === target.getId()) {
        return true;
    }

    // Nothing can be assigned to never-type
    if (target instanceof NeverType) {
        return false;
    }

    // Assigning from or to any-type is always possible
    if (source instanceof AnyType || target instanceof AnyType) {
        return true;
    }

    // assigning to unknown type is always possible
    if (target instanceof UnknownType) {
        return true;
    }

    // Type "never" can be assigned to anything
    if (source instanceof NeverType) {
        return true;
    }

    // Union type is assignable to target when all types in the union are assignable to it
    if (source instanceof UnionType) {
        return source.getTypes().every(type => isAssignableTo(target, type));
    }

    // When source is an intersection type then it can be assigned to target if any of the sub types matches. Object
    // types within the intersection must be combined first
    if (source instanceof IntersectionType) {
        return combineIntersectingTypes(source).some(type => isAssignableTo(target, type));
    }

    // For arrays check if item types are assignable
    if (target instanceof ArrayType) {
        const targetItemType = target.getItem();
        if (source instanceof ArrayType) {
            return isAssignableTo(targetItemType, source.getItem());
        } else if (source instanceof TupleType) {
            return source.getTypes().every(type => isAssignableTo(targetItemType, type));
        } else {
            return false;
        }
    }

    // When target is a union type then check if source type can be assigned to any variant
    if (target instanceof UnionType) {
        return target.getTypes().some(type => isAssignableTo(type, source));
    }

    // When target is an intersection type then source can be assigned to it if it matches all sub types. Object
    // types within the intersection must be combined first
    if (target instanceof IntersectionType) {
        return combineIntersectingTypes(target).every(type => isAssignableTo(type, source));
    }

    if (target instanceof ObjectType) {
        const membersA = getObjectProperties(target);
        if (membersA.length === 0) {
            // When target object is empty then anything except null and undefined can be assigned to it
            return !isAssignableTo(new UnionType([ new UndefinedType(), new NullType() ]), source);
        } else if (source instanceof ObjectType) {
            const membersB = getObjectProperties(source);

            // Check if target has properties in common with source
            const inCommon = membersA.some(memberA => membersB.some(memberB =>
                memberA.getName() === memberB.getName()));

            return membersA.every(memberA => {
                // Make sure that every required property in target type is present
                const memberB = membersB.find(member => memberA.getName() === member.getName());
                return memberB == null ? (inCommon && !memberA.isRequired()) : true;
            }) && membersB.every(memberB => {
                const memberA = membersA.find(member => member.getName() === memberB.getName());
                if (memberA == null) {
                    return true;
                }
                return isAssignableTo(memberA.getType(), memberB.getType());
            });
        }
    }

    // Check if tuple types are compatible
    if (target instanceof TupleType) {
        if (source instanceof TupleType) {
            const membersB = source.getTypes();
            return target.getTypes().every((memberA, i) => {
                const memberB = membersB[i];
                if (memberA instanceof OptionalType) {
                    if (memberB) {
                        return isAssignableTo(memberA, memberB) || isAssignableTo(memberA.getType(), memberB);
                    } else {
                        return true;
                    }
                } else {
                    return isAssignableTo(memberA, memberB);
                }
            });
        }
    }

    return false;
}
