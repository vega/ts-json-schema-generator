"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectTypeFormatter = void 0;
const AnyType_js_1 = require("../Type/AnyType.js");
const SymbolType_js_1 = require("../Type/SymbolType.js");
const BaseType_js_1 = require("../Type/BaseType.js");
const ObjectType_js_1 = require("../Type/ObjectType.js");
const UndefinedType_js_1 = require("../Type/UndefinedType.js");
const UnionType_js_1 = require("../Type/UnionType.js");
const allOfDefinition_js_1 = require("../Utils/allOfDefinition.js");
const derefType_js_1 = require("../Utils/derefType.js");
const preserveAnnotation_js_1 = require("../Utils/preserveAnnotation.js");
const removeUndefined_js_1 = require("../Utils/removeUndefined.js");
const uniqueArray_js_1 = require("../Utils/uniqueArray.js");
const NeverType_js_1 = require("../Type/NeverType.js");
class ObjectTypeFormatter {
    childTypeFormatter;
    constructor(childTypeFormatter) {
        this.childTypeFormatter = childTypeFormatter;
    }
    supportsType(type) {
        return type instanceof ObjectType_js_1.ObjectType;
    }
    getDefinition(type, options) {
        const types = type.getBaseTypes();
        if (types.length === 0) {
            return this.getObjectDefinition(type, options);
        }
        const refResolver = (0, allOfDefinition_js_1.refResolverFromDefinitions)(options?.definitions);
        const reducer = (0, allOfDefinition_js_1.getAllOfDefinitionReducer)(this.childTypeFormatter, refResolver, options);
        return types.reduce(reducer, this.getObjectDefinition(type, options));
    }
    getChildren(type) {
        const properties = type.getProperties();
        const additionalProperties = type.getAdditionalProperties();
        const childrenOfBase = type
            .getBaseTypes()
            .reduce((result, baseType) => [...result, ...this.childTypeFormatter.getChildren(baseType)], []);
        const childrenOfAdditionalProps = additionalProperties instanceof BaseType_js_1.BaseType ? this.childTypeFormatter.getChildren(additionalProperties) : [];
        const childrenOfProps = properties.reduce((result, property) => {
            const propertyType = property.getType();
            if (propertyType instanceof NeverType_js_1.NeverType) {
                return result;
            }
            return [...result, ...this.childTypeFormatter.getChildren(propertyType)];
        }, []);
        const children = [...childrenOfBase, ...childrenOfAdditionalProps, ...childrenOfProps];
        return (0, uniqueArray_js_1.uniqueArray)(children);
    }
    getObjectDefinition(type, options) {
        let objectProperties = type.getProperties();
        const additionalProperties = type.getAdditionalProperties();
        if (additionalProperties === false) {
            objectProperties = objectProperties.filter((property) => !((0, derefType_js_1.derefType)(property.getType()) instanceof NeverType_js_1.NeverType));
        }
        const preparedProperties = objectProperties.map((property) => this.prepareObjectProperty(property));
        const required = preparedProperties
            .filter((property) => property.isRequired())
            .map((property) => property.getName());
        const properties = preparedProperties.reduce((result, property) => {
            result[property.getName()] = this.childTypeFormatter.getDefinition(property.getType(), options);
            return result;
        }, {});
        return {
            type: "object",
            ...(Object.keys(properties).length > 0 ? { properties } : {}),
            ...(required.length > 0 ? { required } : {}),
            ...(additionalProperties === true ||
                additionalProperties instanceof AnyType_js_1.AnyType ||
                additionalProperties instanceof SymbolType_js_1.SymbolType
                ? {}
                : {
                    additionalProperties: additionalProperties instanceof BaseType_js_1.BaseType
                        ? this.childTypeFormatter.getDefinition(additionalProperties, options)
                        : additionalProperties,
                }),
        };
    }
    prepareObjectProperty(property) {
        const propertyType = property.getType();
        const propType = (0, derefType_js_1.derefType)(propertyType);
        if (propType instanceof UndefinedType_js_1.UndefinedType) {
            return new ObjectType_js_1.ObjectProperty(property.getName(), propertyType, false);
        }
        else if (!(propType instanceof UnionType_js_1.UnionType)) {
            return property;
        }
        const { newType: newPropType, numRemoved } = (0, removeUndefined_js_1.removeUndefined)(propType);
        if (numRemoved == 0) {
            return property;
        }
        return new ObjectType_js_1.ObjectProperty(property.getName(), (0, preserveAnnotation_js_1.preserveAnnotation)(propertyType, newPropType), false);
    }
}
exports.ObjectTypeFormatter = ObjectTypeFormatter;
//# sourceMappingURL=ObjectTypeFormatter.js.map