"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectType = exports.ObjectProperty = void 0;
const BaseType_js_1 = require("./BaseType.js");
const String_js_1 = require("../Utils/String.js");
class ObjectProperty {
    name;
    type;
    required;
    constructor(name, type, required) {
        this.name = name;
        this.type = type;
        this.required = required;
    }
    getName() {
        return (0, String_js_1.strip)(this.name);
    }
    getType() {
        return this.type;
    }
    isRequired() {
        return this.required;
    }
}
exports.ObjectProperty = ObjectProperty;
class ObjectType extends BaseType_js_1.BaseType {
    id;
    baseTypes;
    properties;
    additionalProperties;
    nonPrimitive;
    constructor(id, baseTypes, properties, additionalProperties, 
    // whether the object is `object`
    nonPrimitive = false) {
        super();
        this.id = id;
        this.baseTypes = baseTypes;
        this.properties = properties;
        this.additionalProperties = additionalProperties;
        this.nonPrimitive = nonPrimitive;
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
    getNonPrimitive() {
        return this.nonPrimitive;
    }
}
exports.ObjectType = ObjectType;
//# sourceMappingURL=ObjectType.js.map