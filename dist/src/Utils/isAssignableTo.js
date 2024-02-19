"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAssignableTo = void 0;
const AnyType_1 = require("../Type/AnyType");
const ArrayType_1 = require("../Type/ArrayType");
const EnumType_1 = require("../Type/EnumType");
const IntersectionType_1 = require("../Type/IntersectionType");
const NullType_1 = require("../Type/NullType");
const ObjectType_1 = require("../Type/ObjectType");
const OptionalType_1 = require("../Type/OptionalType");
const TupleType_1 = require("../Type/TupleType");
const UndefinedType_1 = require("../Type/UndefinedType");
const UnionType_1 = require("../Type/UnionType");
const UnknownType_1 = require("../Type/UnknownType");
const VoidType_1 = require("../Type/VoidType");
const derefType_1 = require("./derefType");
const LiteralType_1 = require("../Type/LiteralType");
const StringType_1 = require("../Type/StringType");
const NumberType_1 = require("../Type/NumberType");
const BooleanType_1 = require("../Type/BooleanType");
const InferType_1 = require("../Type/InferType");
const RestType_1 = require("../Type/RestType");
const NeverType_1 = require("../Type/NeverType");
function combineIntersectingTypes(intersection) {
    const objectTypes = [];
    const combined = intersection.getTypes().filter((type) => {
        if (type instanceof ObjectType_1.ObjectType) {
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
        combined.push(new ObjectType_1.ObjectType(`combined-objects-${intersection.getId()}`, objectTypes, [], false));
    }
    return combined;
}
function getObjectProperties(type) {
    type = (0, derefType_1.derefType)(type);
    const properties = [];
    if (type instanceof ObjectType_1.ObjectType) {
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
            return new StringType_1.StringType();
        case "number":
            return new NumberType_1.NumberType();
        case "boolean":
            return new BooleanType_1.BooleanType();
    }
}
function isAssignableTo(target, source, inferMap = new Map(), insideTypes = new Set()) {
    var _a;
    source = (0, derefType_1.derefType)(source);
    target = (0, derefType_1.derefType)(target);
    if (source instanceof NeverType_1.NeverType) {
        return true;
    }
    if (target instanceof NeverType_1.NeverType) {
        return false;
    }
    if (target instanceof InferType_1.InferType) {
        const key = target.getName();
        const infer = inferMap.get(key);
        if (infer === undefined) {
            inferMap.set(key, source);
        }
        else {
            inferMap.set(key, new UnionType_1.UnionType([infer, source]));
        }
        return true;
    }
    if (source.getId() === target.getId()) {
        return true;
    }
    if (insideTypes.has(source) || insideTypes.has(target)) {
        return true;
    }
    if (source instanceof AnyType_1.AnyType || target instanceof AnyType_1.AnyType) {
        return true;
    }
    if (target instanceof UnknownType_1.UnknownType) {
        return true;
    }
    if (target instanceof VoidType_1.VoidType) {
        return source instanceof NullType_1.NullType || source instanceof UndefinedType_1.UndefinedType;
    }
    if (source instanceof UnionType_1.UnionType || source instanceof EnumType_1.EnumType) {
        return source.getTypes().every((type) => isAssignableTo(target, type, inferMap, insideTypes));
    }
    if (source instanceof IntersectionType_1.IntersectionType) {
        return combineIntersectingTypes(source).some((type) => isAssignableTo(target, type, inferMap, insideTypes));
    }
    if (target instanceof ArrayType_1.ArrayType) {
        const targetItemType = target.getItem();
        if (source instanceof ArrayType_1.ArrayType) {
            return isAssignableTo(targetItemType, source.getItem(), inferMap, insideTypes);
        }
        else if (source instanceof TupleType_1.TupleType) {
            return isAssignableTo(targetItemType, new UnionType_1.UnionType(source.getTypes()), inferMap, insideTypes);
        }
        else {
            return false;
        }
    }
    if (target instanceof UnionType_1.UnionType || target instanceof EnumType_1.EnumType) {
        return target.getTypes().some((type) => isAssignableTo(type, source, inferMap, insideTypes));
    }
    if (target instanceof IntersectionType_1.IntersectionType) {
        return combineIntersectingTypes(target).every((type) => isAssignableTo(type, source, inferMap, insideTypes));
    }
    if (source instanceof LiteralType_1.LiteralType) {
        return isAssignableTo(target, getPrimitiveType(source.getValue()), inferMap);
    }
    if (target instanceof ObjectType_1.ObjectType) {
        if (target.getNonPrimitive() &&
            (source instanceof NumberType_1.NumberType || source instanceof StringType_1.StringType || source instanceof BooleanType_1.BooleanType)) {
            return false;
        }
        const targetMembers = getObjectProperties(target);
        if (targetMembers.length === 0) {
            return !isAssignableTo(new UnionType_1.UnionType([new UndefinedType_1.UndefinedType(), new NullType_1.NullType()]), source, inferMap, insideTypes);
        }
        else if (source instanceof ObjectType_1.ObjectType) {
            const sourceMembers = getObjectProperties(source);
            const inCommon = targetMembers.some((targetMember) => sourceMembers.some((sourceMember) => targetMember.getName() === sourceMember.getName()));
            return (targetMembers.every((targetMember) => {
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
        const isArrayLikeType = source instanceof ArrayType_1.ArrayType || source instanceof TupleType_1.TupleType;
        if (isArrayLikeType) {
            const lengthPropType = (_a = targetMembers
                .find((prop) => prop.getName() === "length" && prop.isRequired())) === null || _a === void 0 ? void 0 : _a.getType();
            if (source instanceof ArrayType_1.ArrayType) {
                return lengthPropType instanceof NumberType_1.NumberType;
            }
            if (source instanceof TupleType_1.TupleType) {
                if (lengthPropType instanceof LiteralType_1.LiteralType) {
                    const types = source.getTypes();
                    const lengthPropValue = lengthPropType.getValue();
                    return types.length === lengthPropValue;
                }
            }
        }
    }
    if (target instanceof TupleType_1.TupleType) {
        if (source instanceof TupleType_1.TupleType) {
            const sourceMembers = source.getTypes();
            const targetMembers = target.getTypes();
            return targetMembers.every((targetMember, i) => {
                const numTarget = targetMembers.length;
                const numSource = sourceMembers.length;
                if (i == numTarget - 1) {
                    if (numTarget <= numSource + 1) {
                        if (targetMember instanceof RestType_1.RestType) {
                            const remaining = [];
                            for (let j = i; j < numSource; j++) {
                                remaining.push(sourceMembers[j]);
                            }
                            return isAssignableTo(targetMember.getType(), new TupleType_1.TupleType(remaining), inferMap, insideTypes);
                        }
                        else if (numTarget < numSource) {
                            return false;
                        }
                    }
                }
                const sourceMember = sourceMembers[i];
                if (targetMember instanceof OptionalType_1.OptionalType) {
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
exports.isAssignableTo = isAssignableTo;
//# sourceMappingURL=isAssignableTo.js.map