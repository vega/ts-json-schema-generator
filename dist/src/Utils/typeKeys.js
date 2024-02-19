"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTypeByKey = exports.getTypeKeys = void 0;
const IntersectionNodeParser_1 = require("../NodeParser/IntersectionNodeParser");
const AnyType_1 = require("../Type/AnyType");
const ArrayType_1 = require("../Type/ArrayType");
const BaseType_1 = require("../Type/BaseType");
const IntersectionType_1 = require("../Type/IntersectionType");
const LiteralType_1 = require("../Type/LiteralType");
const NumberType_1 = require("../Type/NumberType");
const ObjectType_1 = require("../Type/ObjectType");
const TupleType_1 = require("../Type/TupleType");
const UndefinedType_1 = require("../Type/UndefinedType");
const UnionType_1 = require("../Type/UnionType");
const derefType_1 = require("./derefType");
const preserveAnnotation_1 = require("./preserveAnnotation");
const uniqueArray_1 = require("./uniqueArray");
const uniqueTypeArray_1 = require("./uniqueTypeArray");
function uniqueLiterals(types) {
    const values = types.map((type) => type.getValue());
    return (0, uniqueArray_1.uniqueArray)(values).map((value) => new LiteralType_1.LiteralType(value));
}
function getTypeKeys(type) {
    type = (0, derefType_1.derefType)(type);
    if (type instanceof IntersectionType_1.IntersectionType || type instanceof UnionType_1.UnionType) {
        return uniqueLiterals(type.getTypes().reduce((result, subType) => [...result, ...getTypeKeys(subType)], []));
    }
    if (type instanceof TupleType_1.TupleType) {
        return type.getTypes().map((_it, idx) => new LiteralType_1.LiteralType(idx));
    }
    if (type instanceof ObjectType_1.ObjectType) {
        const objectProperties = type.getProperties().map((it) => new LiteralType_1.LiteralType(it.getName()));
        return uniqueLiterals(type
            .getBaseTypes()
            .reduce((result, parentType) => [...result, ...getTypeKeys(parentType)], objectProperties));
    }
    return [];
}
exports.getTypeKeys = getTypeKeys;
function getTypeByKey(type, index) {
    type = (0, derefType_1.derefType)(type);
    if (type instanceof IntersectionType_1.IntersectionType || type instanceof UnionType_1.UnionType) {
        let subTypes = [];
        let firstType;
        for (const subType of type.getTypes()) {
            const subKeyType = getTypeByKey(subType, index);
            if (subKeyType) {
                subTypes.push(subKeyType);
                if (!firstType) {
                    firstType = subKeyType;
                }
            }
        }
        subTypes = (0, uniqueTypeArray_1.uniqueTypeArray)(subTypes);
        let returnType = undefined;
        if (subTypes.length == 1) {
            return firstType;
        }
        else if (subTypes.length > 1) {
            if (type instanceof UnionType_1.UnionType) {
                returnType = new UnionType_1.UnionType(subTypes);
            }
            else {
                returnType = (0, IntersectionNodeParser_1.translate)(subTypes);
            }
        }
        if (!returnType) {
            return undefined;
        }
        if (!firstType) {
            return returnType;
        }
        return (0, preserveAnnotation_1.preserveAnnotation)(firstType, returnType);
    }
    if (type instanceof TupleType_1.TupleType && index instanceof LiteralType_1.LiteralType) {
        return type.getTypes().find((it, idx) => idx === index.getValue());
    }
    if (type instanceof ArrayType_1.ArrayType && index instanceof NumberType_1.NumberType) {
        return type.getItem();
    }
    if (type instanceof ObjectType_1.ObjectType) {
        if (index instanceof LiteralType_1.LiteralType) {
            const property = type.getProperties().find((it) => it.getName() === index.getValue());
            if (property) {
                const propertyType = property.getType();
                if (propertyType === undefined) {
                    return undefined;
                }
                let newPropType = (0, derefType_1.derefAnnotatedType)(propertyType);
                if (!property.isRequired()) {
                    if (newPropType instanceof UnionType_1.UnionType) {
                        if (!newPropType.getTypes().some((subType) => subType instanceof UndefinedType_1.UndefinedType)) {
                            newPropType = new UnionType_1.UnionType([...newPropType.getTypes(), new UndefinedType_1.UndefinedType()]);
                        }
                    }
                    else {
                        newPropType = new UnionType_1.UnionType([newPropType, new UndefinedType_1.UndefinedType()]);
                    }
                }
                return (0, preserveAnnotation_1.preserveAnnotation)(propertyType, newPropType);
            }
        }
        const additionalProperty = type.getAdditionalProperties();
        if (additionalProperty instanceof BaseType_1.BaseType) {
            return additionalProperty;
        }
        else if (additionalProperty === true) {
            return new AnyType_1.AnyType();
        }
        for (const subType of type.getBaseTypes()) {
            const subKeyType = getTypeByKey(subType, index);
            if (subKeyType) {
                return subKeyType;
            }
        }
        return undefined;
    }
    return undefined;
}
exports.getTypeByKey = getTypeByKey;
//# sourceMappingURL=typeKeys.js.map