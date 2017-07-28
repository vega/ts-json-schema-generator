"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
const AliasType_1 = require("../Type/AliasType");
const AnnotatedType_1 = require("../Type/AnnotatedType");
const DefinitionType_1 = require("../Type/DefinitionType");
const ReferenceType_1 = require("../Type/ReferenceType");
const uniqueArray_1 = require("./uniqueArray");
function getNonRefType(type) {
    if (type instanceof ReferenceType_1.ReferenceType || type instanceof DefinitionType_1.DefinitionType ||
        type instanceof AliasType_1.AliasType || type instanceof AnnotatedType_1.AnnotatedType) {
        return getNonRefType(type.getType());
    }
    return type;
}
function getAllOfDefinitionReducer(childTypeFormatter) {
    return (definition, baseType) => {
        const other = childTypeFormatter.getDefinition(getNonRefType(baseType));
        definition.properties = Object.assign({}, other.properties, definition.properties);
        function additionalPropsDefinition(props) {
            return props !== undefined && props !== true;
        }
        if (additionalPropsDefinition(definition.additionalProperties) &&
            additionalPropsDefinition(other.additionalProperties)) {
            let additionalProps = [];
            let additionalTypes = [];
            const addAdditionalProps = (addProps) => {
                if (addProps !== false) {
                    if (addProps.anyOf) {
                        for (const prop of addProps.anyOf) {
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
                        additionalTypes = additionalTypes.concat(util_1.isArray(addProps.type) ?
                            addProps.type : [addProps.type]);
                    }
                    else {
                        additionalProps.push(addProps);
                    }
                }
            };
            addAdditionalProps(definition.additionalProperties);
            addAdditionalProps(other.additionalProperties);
            additionalTypes = uniqueArray_1.uniqueArray(additionalTypes);
            additionalProps = uniqueArray_1.uniqueArray(additionalProps);
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
                if (Object.keys(additionalProps[0]).length === 0) {
                    delete definition.additionalProperties;
                }
                else {
                    definition.additionalProperties = additionalProps[0];
                }
            }
            else {
                definition.additionalProperties = false;
            }
        }
        if (other.required) {
            definition.required = uniqueArray_1.uniqueArray((definition.required || []).concat(other.required)).sort();
        }
        return definition;
    };
}
exports.getAllOfDefinitionReducer = getAllOfDefinitionReducer;
//# sourceMappingURL=allOfDefinition.js.map