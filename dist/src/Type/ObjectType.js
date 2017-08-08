"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseType_1 = require("./BaseType");
class ObjectProperty {
    constructor(name, type, required) {
        this.name = name;
        this.type = type;
        this.required = required;
    }
    getName() {
        return this.name;
    }
    getType() {
        return this.type;
    }
    isRequired() {
        return this.required;
    }
}
exports.ObjectProperty = ObjectProperty;
class ObjectType extends BaseType_1.BaseType {
    constructor(id, baseTypes, properties, additionalProperties) {
        super();
        this.id = id;
        this.baseTypes = baseTypes;
        this.properties = properties;
        this.additionalProperties = additionalProperties;
    }
    getId() {
        return this.id;
    }
    getBaseTypes() {
        return this.baseTypes;
    }
    getProperties() {
        return this.properties;
    }
    getAdditionalProperties() {
        return this.additionalProperties;
    }
}
exports.ObjectType = ObjectType;
//# sourceMappingURL=ObjectType.js.map