import { isArray } from "util";
import { Definition } from "../Schema/Definition";
import { RawTypeName } from "../Schema/RawType";
import { AliasType } from "../Type/AliasType";
import { AnnotatedType } from "../Type/AnnotatedType";
import { BaseType } from "../Type/BaseType";
import { DefinitionType } from "../Type/DefinitionType";
import { ReferenceType } from "../Type/ReferenceType";
import { TypeFormatter } from "../TypeFormatter";
import { uniqueArray } from "./uniqueArray";
import { deepMerge } from "./deepMerge";

function getNonRefType(type: BaseType): BaseType {
    if (
        type instanceof ReferenceType ||
        type instanceof DefinitionType ||
        type instanceof AliasType ||
        type instanceof AnnotatedType
    ) {
        return getNonRefType(type.getType());
    }
    return type;
}

// TODO: Can we do this at parse time? See heritage clause in interfaces.
// TODO: We really only need this if the children use additionalProperties: false.
export function getAllOfDefinitionReducer(childTypeFormatter: TypeFormatter, concatArrays: boolean) {
    // combine object instead of using allOf because allOf does not work well with additional properties
    return (definition: Definition, baseType: BaseType) => {
        const other = childTypeFormatter.getDefinition(getNonRefType(baseType));

        definition.properties = deepMerge(other.properties || {}, definition.properties || {}, concatArrays);

        function additionalPropsDefinition(props?: boolean | Definition): props is Definition {
            return props !== undefined && props !== true;
        }

        if (
            additionalPropsDefinition(definition.additionalProperties) &&
            additionalPropsDefinition(other.additionalProperties)
        ) {
            // additional properties is false only if all children also set additional properties to false
            // collect additional properties and merge into a single definition
            let additionalProps: Definition[] = [];
            let additionalTypes: RawTypeName[] = [];
            const addAdditionalProps: (addProps: Definition) => void = (addProps: Definition) => {
                if (addProps !== false) {
                    if (addProps.anyOf) {
                        for (const prop of addProps.anyOf as Definition[]) {
                            if (prop.type) {
                                additionalTypes = additionalTypes.concat(isArray(prop.type) ? prop.type : [prop.type]);
                            } else {
                                additionalProps.push(prop);
                            }
                        }
                    } else if (addProps.type) {
                        additionalTypes = additionalTypes.concat(
                            isArray(addProps.type) ? addProps.type : [addProps.type]
                        );
                    } else {
                        additionalProps.push(addProps);
                    }
                }
            };

            addAdditionalProps(definition.additionalProperties);
            addAdditionalProps(other.additionalProperties);

            additionalTypes = uniqueArray(additionalTypes);
            additionalProps = uniqueArray(additionalProps);

            if (additionalTypes.length > 1) {
                additionalProps.push({
                    type: additionalTypes,
                });
            } else if (additionalTypes.length === 1) {
                additionalProps.push({
                    type: additionalTypes[0],
                });
            }

            if (additionalProps.length > 1) {
                definition.additionalProperties = {
                    anyOf: additionalProps,
                };
            } else if (additionalProps.length === 1) {
                if (Object.keys(additionalProps[0]).length === 0) {
                    delete definition.additionalProperties;
                } else {
                    definition.additionalProperties = additionalProps[0];
                }
            } else {
                definition.additionalProperties = false;
            }
        }

        if (other.required) {
            definition.required = uniqueArray((definition.required || []).concat(other.required)).sort();
        }

        return definition;
    };
}
