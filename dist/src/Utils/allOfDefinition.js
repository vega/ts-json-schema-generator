"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("util");
var AliasType_1 = require("../Type/AliasType");
var AnnotatedType_1 = require("../Type/AnnotatedType");
var DefinitionType_1 = require("../Type/DefinitionType");
var ReferenceType_1 = require("../Type/ReferenceType");
var uniqueArray_1 = require("./uniqueArray");
function getNonRefType(type) {
    if (type instanceof ReferenceType_1.ReferenceType || type instanceof DefinitionType_1.DefinitionType ||
        type instanceof AliasType_1.AliasType || type instanceof AnnotatedType_1.AnnotatedType) {
        return getNonRefType(type.getType());
    }
    return type;
}
function getAllOfDefinitionReducer(childTypeFormatter) {
    return function (definition, baseType) {
        var other = childTypeFormatter.getDefinition(getNonRefType(baseType));
        definition.properties = __assign({}, definition.properties, other.properties);
        var additionalProps = [];
        var additionalTypes = [];
        function addAdditionalProps(addProps) {
            if (addProps) {
                if (addProps.anyOf) {
                    for (var _i = 0, _a = addProps.anyOf; _i < _a.length; _i++) {
                        var prop = _a[_i];
                        if (prop.type) {
                            additionalTypes = additionalTypes.concat(util_1.isArray(prop.type) ?
                                prop.type : [prop.type]);
                        }
                        else {
                            additionalProps.push(prop);
                        }
                    }
                }
                else if (addProps.type) {
                    additionalTypes = additionalTypes.concat(util_1.isArray(addProps.type) ? addProps.type : [addProps.type]);
                }
                else {
                    additionalProps.push(addProps);
                }
            }
        }
        addAdditionalProps(definition.additionalProperties);
        addAdditionalProps(other.additionalProperties);
        additionalTypes = uniqueArray_1.uniqueArray(additionalTypes);
        if (additionalTypes.length > 1) {
            additionalProps.push({
                type: additionalTypes,
            });
        }
        else if (additionalTypes.length === 1) {
            additionalProps.push({
                type: additionalTypes[0],
            });
        }
        if (additionalProps.length > 1) {
            definition.additionalProperties = {
                anyOf: additionalProps,
            };
        }
        else if (additionalProps.length === 1) {
            definition.additionalProperties = additionalProps[0];
        }
        else {
            definition.additionalProperties = false;
        }
        if (other.required) {
            definition.required = uniqueArray_1.uniqueArray((definition.required || []).concat(other.required)).sort();
        }
        return definition;
    };
}
exports.getAllOfDefinitionReducer = getAllOfDefinitionReducer;
//# sourceMappingURL=allOfDefinition.js.map