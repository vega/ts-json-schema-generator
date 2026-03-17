"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refResolverFromDefinitions = refResolverFromDefinitions;
exports.getAllOfDefinitionReducer = getAllOfDefinitionReducer;
const uniqueArray_js_1 = require("./uniqueArray.js");
const deepMerge_js_1 = require("./deepMerge.js");
const derefType_js_1 = require("./derefType.js");
function refResolverFromDefinitions(definitions) {
    if (!definitions)
        return undefined;
    return (ref) => {
        const key = ref.replace(/^#\/definitions\//, "");
        return definitions[decodeURIComponent(key)];
    };
}
// TODO: Can we do this at parse time? See heritage clause in interfaces.
// TODO: We really only need this if the children use additionalProperties: false.
function getAllOfDefinitionReducer(childTypeFormatter, refResolver, options) {
    // combine object instead of using allOf because allOf does not work well with additional properties
    return (definition, baseType) => {
        let other = childTypeFormatter.getDefinition((0, derefType_js_1.derefType)(baseType), options);
        if (refResolver && other.$ref && (!other.properties || Object.keys(other.properties).length === 0)) {
            const resolved = refResolver(other.$ref);
            if (resolved) {
                other = resolved;
            }
        }
        definition.properties = (0, deepMerge_js_1.deepMerge)(other.properties || {}, definition.properties || {});
        function additionalPropsDefinition(props) {
            return props !== undefined && props !== true;
        }
        if (additionalPropsDefinition(definition.additionalProperties) &&
            additionalPropsDefinition(other.additionalProperties)) {
            // additional properties is false only if all children also set additional properties to false
            // collect additional properties and merge into a single definition
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
            additionalTypes = (0, uniqueArray_js_1.uniqueArray)(additionalTypes);
            additionalProps = (0, uniqueArray_js_1.uniqueArray)(additionalProps);
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
            definition.required = (0, uniqueArray_js_1.uniqueArray)((definition.required || []).concat(other.required)).sort();
        }
        if ((other.additionalProperties || other.additionalProperties === undefined) &&
            definition.additionalProperties == false) {
            delete definition.additionalProperties;
        }
        return definition;
    };
}
//# sourceMappingURL=allOfDefinition.js.map