"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllOfDefinitionReducer = void 0;
const uniqueArray_1 = require("./uniqueArray");
const deepMerge_1 = require("./deepMerge");
const derefType_1 = require("./derefType");
function getAllOfDefinitionReducer(childTypeFormatter) {
    return (definition, baseType) => {
        const other = childTypeFormatter.getDefinition((0, derefType_1.derefType)(baseType));
        definition.properties = (0, deepMerge_1.deepMerge)(other.properties || {}, definition.properties || {});
        function additionalPropsDefinition(props) {
            return props !== undefined && props !== true;
        }
        if (additionalPropsDefinition(definition.additionalProperties) &&
            additionalPropsDefinition(other.additionalProperties)) {
            let additionalProps = [];
            let additionalTypes = [];
            const addAdditionalProps = (addProps) => {
                if (addProps) {
                    if (addProps.anyOf) {
                        for (const prop of addProps.anyOf) {
                            if (prop.type) {
                                additionalTypes = additionalTypes.concat(Array.isArray(prop.type) ? prop.type : [prop.type]);
                            }
                            else {
                                additionalProps.push(prop);
                            }
                        }
                    }
                    else if (addProps.type) {
                        additionalTypes = additionalTypes.concat(Array.isArray(addProps.type) ? addProps.type : [addProps.type]);
                    }
                    else {
                        additionalProps.push(addProps);
                    }
                }
            };
            addAdditionalProps(definition.additionalProperties);
            addAdditionalProps(other.additionalProperties);
            additionalTypes = (0, uniqueArray_1.uniqueArray)(additionalTypes);
            additionalProps = (0, uniqueArray_1.uniqueArray)(additionalProps);
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
            definition.required = (0, uniqueArray_1.uniqueArray)((definition.required || []).concat(other.required)).sort();
        }
        if ((other.additionalProperties || other.additionalProperties === undefined) &&
            definition.additionalProperties == false) {
            delete definition.additionalProperties;
        }
        return definition;
    };
}
exports.getAllOfDefinitionReducer = getAllOfDefinitionReducer;
//# sourceMappingURL=allOfDefinition.js.map