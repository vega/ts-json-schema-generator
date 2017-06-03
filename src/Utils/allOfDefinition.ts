import { isArray } from "util";
import { Definition } from "../Schema/Definition";
import { AliasType } from "../Type/AliasType";
import { AnnotatedType } from "../Type/AnnotatedType";
import { BaseType } from "../Type/BaseType";
import { DefinitionType } from "../Type/DefinitionType";
import { ReferenceType } from "../Type/ReferenceType";
import { TypeFormatter } from "../TypeFormatter";
import { uniqueArray } from "./uniqueArray";


function getNonRefType(type: BaseType): BaseType {
    if (type instanceof ReferenceType || type instanceof DefinitionType ||
        type instanceof AliasType || type instanceof AnnotatedType) {
        return getNonRefType(type.getType());
    }
    return type;
}

// TODO: Can we do this at parse time? See heritage clause in interfaces.
// TODO: We really only need this if the children use additionalProperties: false.
export function getAllOfDefinitionReducer(childTypeFormatter: TypeFormatter) {
    // combine object instead of using allOf because allOf does not work well with additional properties
    return (definition: Definition, baseType: BaseType) => {
        const other: Definition = childTypeFormatter.getDefinition(getNonRefType(baseType));

        definition.properties = {
            ...definition.properties,
            ...other.properties,
        };

        // additional properties is false only if all children also set additional properties to false
        // collect additional properties and merge into a single definition
        const additionalProps: Definition[] = [];
        let additionalTypes: string[] = [];
        function addAdditionalProps(addProps?: false | Definition) {
            if (addProps) {
                if (addProps.anyOf) {
                    for (const prop of addProps.anyOf) {
                        if (prop.type) {
                            additionalTypes = additionalTypes.concat(isArray(prop.type) ?
                                prop.type : [prop.type] );
                        } else {
                            additionalProps.push(prop);
                        }
                    }
                } else if (addProps.type) {
                    additionalTypes = additionalTypes.concat(isArray(addProps.type) ? addProps.type : [addProps.type] );
                } else {
                    additionalProps.push(addProps);
                }
            }
        }

        addAdditionalProps(definition.additionalProperties);
        addAdditionalProps(other.additionalProperties);

        additionalTypes = uniqueArray(additionalTypes);

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
            definition.additionalProperties = additionalProps[0];
        } else {
            definition.additionalProperties = false;
        }

        if (other.required) {
            definition.required = uniqueArray((definition.required || []).concat(other.required)).sort();
        }

        return definition;
    };
}
