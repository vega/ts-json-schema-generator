"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AnyType_1 = require("../Type/AnyType");
const BaseType_1 = require("../Type/BaseType");
const ObjectType_1 = require("../Type/ObjectType");
const allOfDefinition_1 = require("../Utils/allOfDefinition");
class ObjectTypeFormatter {
    constructor(childTypeFormatter) {
        this.childTypeFormatter = childTypeFormatter;
    }
    supportsType(type) {
        return type instanceof ObjectType_1.ObjectType;
    }
    getDefinition(type) {
        if (type.getBaseTypes().length === 0) {
            return this.getObjectDefinition(type);
        }
        if (Object.keys(type.getProperties()).length === 0 &&
            type.getAdditionalProperties() === false &&
            type.getBaseTypes().length === 1) {
            return this.childTypeFormatter.getDefinition(type.getBaseTypes()[0]);
        }
        return type.getBaseTypes().reduce(allOfDefinition_1.getAllOfDefinitionReducer(this.childTypeFormatter), this.getObjectDefinition(type));
    }
    getChildren(type) {
        const properties = type.getProperties();
        const additionalProperties = type.getAdditionalProperties();
        return [
            ...type.getBaseTypes().reduce((result, baseType) => [
                ...result,
                ...this.childTypeFormatter.getChildren(baseType),
            ], []),
            ...additionalProperties instanceof BaseType_1.BaseType ?
                this.childTypeFormatter.getChildren(additionalProperties) :
                [],
            ...properties.reduce((result, property) => [
                ...result,
                ...this.childTypeFormatter.getChildren(property.getType()),
            ], []),
        ];
    }
    getObjectDefinition(type) {
        const objectProperties = type.getProperties();
        const additionalProperties = type.getAdditionalProperties();
        const required = objectProperties
            .filter((property) => property.isRequired())
            .map((property) => property.getName());
        const properties = objectProperties.reduce((result, property) => {
            result[property.getName()] = this.childTypeFormatter.getDefinition(property.getType());
            return result;
        }, {});
        return Object.assign({ type: "object" }, (Object.keys(properties).length > 0 ? { properties } : {}), (required.length > 0 ? { required } : {}), (additionalProperties === true || additionalProperties instanceof AnyType_1.AnyType ? {} :
            { additionalProperties: additionalProperties instanceof BaseType_1.BaseType ?
                    this.childTypeFormatter.getDefinition(additionalProperties) :
                    additionalProperties }));
    }
}
exports.ObjectTypeFormatter = ObjectTypeFormatter;
//# sourceMappingURL=ObjectTypeFormatter.js.map