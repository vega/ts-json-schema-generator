"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTypeKeys = getTypeKeys;
exports.getTypeByKey = getTypeByKey;
const IntersectionNodeParser_js_1 = require("../NodeParser/IntersectionNodeParser.js");
const AnyType_js_1 = require("../Type/AnyType.js");
const ArrayType_js_1 = require("../Type/ArrayType.js");
const BaseType_js_1 = require("../Type/BaseType.js");
const IntersectionType_js_1 = require("../Type/IntersectionType.js");
const LiteralType_js_1 = require("../Type/LiteralType.js");
const NumberType_js_1 = require("../Type/NumberType.js");
const ObjectType_js_1 = require("../Type/ObjectType.js");
const TupleType_js_1 = require("../Type/TupleType.js");
const UndefinedType_js_1 = require("../Type/UndefinedType.js");
const UnionType_js_1 = require("../Type/UnionType.js");
const derefType_js_1 = require("./derefType.js");
const preserveAnnotation_js_1 = require("./preserveAnnotation.js");
const uniqueArray_js_1 = require("./uniqueArray.js");
const uniqueTypeArray_js_1 = require("./uniqueTypeArray.js");
function uniqueLiterals(types) {
    const values = types.map((type) => type.getValue());
    return (0, uniqueArray_js_1.uniqueArray)(values).map((value) => new LiteralType_js_1.LiteralType(value));
}
function getTypeKeys(type) {
    type = (0, derefType_js_1.derefType)(type);
    if (type instanceof IntersectionType_js_1.IntersectionType || type instanceof UnionType_js_1.UnionType) {
        return uniqueLiterals(type.getTypes().reduce((result, subType) => [...result, ...getTypeKeys(subType)], []));
    }
    if (type instanceof TupleType_js_1.TupleType) {
        return type.getTypes().map((_it, idx) => new LiteralType_js_1.LiteralType(idx));
    }
    if (type instanceof ObjectType_js_1.ObjectType) {
        const objectProperties = type.getProperties().map((it) => new LiteralType_js_1.LiteralType(it.getName()));
        return uniqueLiterals(type
            .getBaseTypes()
            .reduce((result, parentType) => [...result, ...getTypeKeys(parentType)], objectProperties));
    }
    return [];
}
function getTypeByKey(type, index) {
    type = (0, derefType_js_1.derefType)(type);
    if (type instanceof IntersectionType_js_1.IntersectionType || type instanceof UnionType_js_1.UnionType) {
        let subTypes = [];
        // we use the annotation from the first type so we need to get a reference to it
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
        subTypes = (0, uniqueTypeArray_js_1.uniqueTypeArray)(subTypes);
        let returnType = undefined;
        if (subTypes.length == 1) {
            return firstType;
        }
        else if (subTypes.length > 1) {
            if (type instanceof UnionType_js_1.UnionType) {
                returnType = new UnionType_js_1.UnionType(subTypes);
            }
            else {
                returnType = (0, IntersectionNodeParser_js_1.translate)(subTypes);
            }
        }
        if (!returnType) {
            return undefined;
        }
        if (!firstType) {
            return returnType;
        }
        return (0, preserveAnnotation_js_1.preserveAnnotation)(firstType, returnType);
    }
    if (type instanceof TupleType_js_1.TupleType && index instanceof LiteralType_js_1.LiteralType) {
        return type.getTypes().find((it, idx) => idx === index.getValue());
    }
    if (type instanceof ArrayType_js_1.ArrayType && index instanceof NumberType_js_1.NumberType) {
        return type.getItem();
    }
    if (type instanceof ObjectType_js_1.ObjectType) {
        if (index instanceof LiteralType_js_1.LiteralType) {
            const property = type.getProperties().find((it) => it.getName() === index.getValue());
            if (property) {
                const propertyType = property.getType();
                if (propertyType === undefined) {
                    return undefined;
                }
                let newPropType = (0, derefType_js_1.derefAnnotatedType)(propertyType);
                if (!property.isRequired()) {
                    if (newPropType instanceof UnionType_js_1.UnionType) {
                        if (!newPropType.getTypes().some((subType) => subType instanceof UndefinedType_js_1.UndefinedType)) {
                            newPropType = new UnionType_js_1.UnionType([...newPropType.getTypes(), new UndefinedType_js_1.UndefinedType()]);
                        }
                    }
                    else {
                        newPropType = new UnionType_js_1.UnionType([newPropType, new UndefinedType_js_1.UndefinedType()]);
                    }
                }
                return (0, preserveAnnotation_js_1.preserveAnnotation)(propertyType, newPropType);
            }
        }
        const additionalProperty = type.getAdditionalProperties();
        if (additionalProperty instanceof BaseType_js_1.BaseType) {
            return additionalProperty;
        }
        else if (additionalProperty === true) {
            return new AnyType_js_1.AnyType();
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
//# sourceMappingURL=typeKeys.js.map