"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAssignableTo = isAssignableTo;
const AnyType_js_1 = require("../Type/AnyType.js");
const ArrayType_js_1 = require("../Type/ArrayType.js");
const EnumType_js_1 = require("../Type/EnumType.js");
const IntersectionType_js_1 = require("../Type/IntersectionType.js");
const NullType_js_1 = require("../Type/NullType.js");
const ObjectType_js_1 = require("../Type/ObjectType.js");
const OptionalType_js_1 = require("../Type/OptionalType.js");
const TupleType_js_1 = require("../Type/TupleType.js");
const UndefinedType_js_1 = require("../Type/UndefinedType.js");
const UnionType_js_1 = require("../Type/UnionType.js");
const UnknownType_js_1 = require("../Type/UnknownType.js");
const VoidType_js_1 = require("../Type/VoidType.js");
const derefType_js_1 = require("./derefType.js");
const LiteralType_js_1 = require("../Type/LiteralType.js");
const StringType_js_1 = require("../Type/StringType.js");
const NumberType_js_1 = require("../Type/NumberType.js");
const BooleanType_js_1 = require("../Type/BooleanType.js");
const InferType_js_1 = require("../Type/InferType.js");
const RestType_js_1 = require("../Type/RestType.js");
const NeverType_js_1 = require("../Type/NeverType.js");
/**
 * Returns the combined types from the given intersection. Currently only object types are combined. Maybe more
 * types needs to be combined to properly support complex intersections.
 *
 * @param intersection - The intersection type to combine.
 * @return The combined types within the intersection.
 */
function combineIntersectingTypes(intersection) {
    const objectTypes = [];
    const combined = intersection.getTypes().filter((type) => {
        if (type instanceof ObjectType_js_1.ObjectType) {
            objectTypes.push(type);
        }
        else {
            return true;
        }
        return false;
    });
    if (objectTypes.length === 1) {
        combined.push(objectTypes[0]);
    }
    else if (objectTypes.length > 1) {
        combined.push(new ObjectType_js_1.ObjectType(`combined-objects-${intersection.getId()}`, objectTypes, [], false));
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
function getObjectProperties(type) {
    type = (0, derefType_js_1.derefType)(type);
    const properties = [];
    if (type instanceof ObjectType_js_1.ObjectType) {
        properties.push(...type.getProperties());
        for (const baseType of type.getBaseTypes()) {
            properties.push(...getObjectProperties(baseType));
        }
    }
    return properties;
}
function getPrimitiveType(value) {
    switch (typeof value) {
        case "string":
            return new StringType_js_1.StringType();
        case "number":
            return new NumberType_js_1.NumberType();
        case "boolean":
            return new BooleanType_js_1.BooleanType();
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
function isAssignableTo(target, source, inferMap = new Map(), insideTypes = new Set()) {
    // Dereference source and target
    source = (0, derefType_js_1.derefType)(source);
    target = (0, derefType_js_1.derefType)(target);
    // Type "never" can be assigned to anything
    if (source instanceof NeverType_js_1.NeverType) {
        return true;
    }
    // Nothing can be assigned to "never"
    if (target instanceof NeverType_js_1.NeverType) {
        return false;
    }
    // Infer type can become anything
    if (target instanceof InferType_js_1.InferType) {
        const key = target.getName();
        const infer = inferMap.get(key);
        if (infer === undefined) {
            inferMap.set(key, source);
        }
        else {
            inferMap.set(key, new UnionType_js_1.UnionType([infer, source]));
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
    if (source instanceof AnyType_js_1.AnyType || target instanceof AnyType_js_1.AnyType) {
        return true;
    }
    // assigning to unknown type is always possible
    if (target instanceof UnknownType_js_1.UnknownType) {
        return true;
    }
    // 'null', or 'undefined' can be assigned to the void
    if (target instanceof VoidType_js_1.VoidType) {
        return source instanceof NullType_js_1.NullType || source instanceof UndefinedType_js_1.UndefinedType;
    }
    // Union and enum type is assignable to target when all types in the union/enum are assignable to it
    if (source instanceof UnionType_js_1.UnionType || source instanceof EnumType_js_1.EnumType) {
        return source.getTypes().every((type) => isAssignableTo(target, type, inferMap, insideTypes));
    }
    // When source is an intersection type then it can be assigned to target if any of the sub types matches. Object
    // types within the intersection must be combined first
    if (source instanceof IntersectionType_js_1.IntersectionType) {
        return combineIntersectingTypes(source).some((type) => isAssignableTo(target, type, inferMap, insideTypes));
    }
    // For arrays check if item types are assignable
    if (target instanceof ArrayType_js_1.ArrayType) {
        const targetItemType = target.getItem();
        if (source instanceof ArrayType_js_1.ArrayType) {
            return isAssignableTo(targetItemType, source.getItem(), inferMap, insideTypes);
        }
        else if (source instanceof TupleType_js_1.TupleType) {
            return isAssignableTo(targetItemType, new UnionType_js_1.UnionType(source.getTypes()), inferMap, insideTypes);
        }
        else {
            return false;
        }
    }
    // When target is a union or enum type then check if source type can be assigned to any variant
    if (target instanceof UnionType_js_1.UnionType || target instanceof EnumType_js_1.EnumType) {
        return target.getTypes().some((type) => isAssignableTo(type, source, inferMap, insideTypes));
    }
    // When target is an intersection type then source can be assigned to it if it matches all sub types. Object
    // types within the intersection must be combined first
    if (target instanceof IntersectionType_js_1.IntersectionType) {
        return combineIntersectingTypes(target).every((type) => isAssignableTo(type, source, inferMap, insideTypes));
    }
    // Check literal types
    if (source instanceof LiteralType_js_1.LiteralType) {
        return isAssignableTo(target, getPrimitiveType(source.getValue()), inferMap);
    }
    if (target instanceof ObjectType_js_1.ObjectType) {
        // primitives are not assignable to `object`
        if (target.getNonPrimitive() &&
            (source instanceof NumberType_js_1.NumberType || source instanceof StringType_js_1.StringType || source instanceof BooleanType_js_1.BooleanType)) {
            return false;
        }
        const targetMembers = getObjectProperties(target);
        if (targetMembers.length === 0) {
            // When target object is empty then anything except null and undefined can be assigned to it
            return !isAssignableTo(new UnionType_js_1.UnionType([new UndefinedType_js_1.UndefinedType(), new NullType_js_1.NullType()]), source, inferMap, insideTypes);
        }
        else if (source instanceof ObjectType_js_1.ObjectType) {
            const sourceMembers = getObjectProperties(source);
            // Check if target has properties in common with source
            const inCommon = targetMembers.some((targetMember) => sourceMembers.some((sourceMember) => targetMember.getName() === sourceMember.getName()));
            return (targetMembers.every((targetMember) => {
                // Make sure that every required property in target type is present
                const sourceMember = sourceMembers.find((member) => targetMember.getName() === member.getName());
                return sourceMember == null ? inCommon && !targetMember.isRequired() : true;
            }) &&
                sourceMembers.every((sourceMember) => {
                    const targetMember = targetMembers.find((member) => member.getName() === sourceMember.getName());
                    if (targetMember == null) {
                        return true;
                    }
                    return isAssignableTo(targetMember.getType(), sourceMember.getType(), inferMap, new Set(insideTypes).add(source).add(target));
                }));
        }
        const isArrayLikeType = source instanceof ArrayType_js_1.ArrayType || source instanceof TupleType_js_1.TupleType;
        if (isArrayLikeType) {
            const lengthPropType = targetMembers
                .find((prop) => prop.getName() === "length" && prop.isRequired())
                ?.getType();
            if (source instanceof ArrayType_js_1.ArrayType) {
                return lengthPropType instanceof NumberType_js_1.NumberType;
            }
            if (source instanceof TupleType_js_1.TupleType) {
                if (lengthPropType instanceof LiteralType_js_1.LiteralType) {
                    const types = source.getTypes();
                    const lengthPropValue = lengthPropType.getValue();
                    return types.length === lengthPropValue;
                }
            }
        }
    }
    // Check if tuple types are compatible
    if (target instanceof TupleType_js_1.TupleType) {
        if (source instanceof TupleType_js_1.TupleType) {
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
                        if (targetMember instanceof RestType_js_1.RestType) {
                            const remaining = [];
                            for (let j = i; j < numSource; j++) {
                                remaining.push(sourceMembers[j]);
                            }
                            return isAssignableTo(targetMember.getType(), new TupleType_js_1.TupleType(remaining), inferMap, insideTypes);
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
                if (targetMember instanceof OptionalType_js_1.OptionalType) {
                    if (sourceMember) {
                        return (isAssignableTo(targetMember, sourceMember, inferMap, insideTypes) ||
                            isAssignableTo(targetMember.getType(), sourceMember, inferMap, insideTypes));
                    }
                    else {
                        return true;
                    }
                }
                else {
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
//# sourceMappingURL=isAssignableTo.js.map