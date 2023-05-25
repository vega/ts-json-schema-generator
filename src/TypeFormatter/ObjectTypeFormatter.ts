import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { AnyType } from "../Type/AnyType";
import { SymbolType } from "../Type/SymbolType";
import { BaseType } from "../Type/BaseType";
import { ObjectProperty, ObjectType } from "../Type/ObjectType";
import { UndefinedType } from "../Type/UndefinedType";
import { UnionType } from "../Type/UnionType";
import { TypeFormatter } from "../TypeFormatter";
import { getAllOfDefinitionReducer } from "../Utils/allOfDefinition";
import { derefType } from "../Utils/derefType";
import { preserveAnnotation } from "../Utils/preserveAnnotation";
import { removeUndefined } from "../Utils/removeUndefined";
import { StringMap } from "../Utils/StringMap";
import { uniqueArray } from "../Utils/uniqueArray";
import { NeverType } from "../Type/NeverType";

export class ObjectTypeFormatter implements SubTypeFormatter {
    public constructor(protected childTypeFormatter: TypeFormatter) {}

    public supportsType(type: ObjectType): boolean {
        return type instanceof ObjectType;
    }

    public getDefinition(type: ObjectType): Definition {
        const types = type.getBaseTypes();
        if (types.length === 0) {
            return this.getObjectDefinition(type);
        }

        return types.reduce(getAllOfDefinitionReducer(this.childTypeFormatter), this.getObjectDefinition(type));
    }

    public getChildren(type: ObjectType): BaseType[] {
        const properties = type.getProperties();
        const additionalProperties: BaseType | boolean = type.getAdditionalProperties();

        const childrenOfBase = type
            .getBaseTypes()
            .reduce(
                (result: BaseType[], baseType) => [...result, ...this.childTypeFormatter.getChildren(baseType)],
                []
            );

        const childrenOfAdditionalProps =
            additionalProperties instanceof BaseType ? this.childTypeFormatter.getChildren(additionalProperties) : [];

        const childrenOfProps = properties.reduce((result: BaseType[], property) => {
            const propertyType = property.getType();
            if (propertyType instanceof NeverType) {
                return result;
            }

            return [...result, ...this.childTypeFormatter.getChildren(propertyType)];
        }, []);

        const children = [...childrenOfBase, ...childrenOfAdditionalProps, ...childrenOfProps];

        return uniqueArray(children);
    }

    protected getObjectDefinition(type: ObjectType): Definition {
        let objectProperties = type.getProperties();
        const additionalProperties: BaseType | boolean = type.getAdditionalProperties();

        if (additionalProperties === false) {
            objectProperties = objectProperties.filter(
                (property) => !(derefType(property.getType()) instanceof NeverType)
            );
        }

        const preparedProperties = objectProperties.map((property) => this.prepareObjectProperty(property));

        const required = preparedProperties
            .filter((property) => property.isRequired())
            .map((property) => property.getName());

        const properties = preparedProperties.reduce((result: StringMap<Definition>, property) => {
            result[property.getName()] = this.childTypeFormatter.getDefinition(property.getType());
            return result;
        }, {});

        const dependentRequiredMap = preparedProperties.reduce((result: StringMap<string[]>, property) => {
            const requiredArray = result[property.getName()] || [];
            const dependentRequired = property.getDependentRequired();
            if (dependentRequired) {
                requiredArray.push(dependentRequired);
            }
            if (requiredArray.length > 0) {
                result[property.getName()] = requiredArray;
            }
            return result;
        }, {});

        return {
            type: "object",
            ...(Object.keys(properties).length > 0 ? { properties } : {}),
            ...(required.length > 0 ? { required } : {}),
            ...(additionalProperties === true ||
            additionalProperties instanceof AnyType ||
            additionalProperties instanceof SymbolType
                ? {}
                : {
                      additionalProperties:
                          additionalProperties instanceof BaseType
                              ? this.childTypeFormatter.getDefinition(additionalProperties)
                              : additionalProperties,
                  }),
            // it seems that JSON Schema7 does not support dependentMap property
            // but dependencies can be used instead
            ...(Object.keys(dependentRequiredMap).length > 0 ? { dependencies: dependentRequiredMap } : {}),
        };
    }

    protected prepareObjectProperty(property: ObjectProperty): ObjectProperty {
        const propertyType = property.getType();
        const propType = derefType(propertyType);

        if (propType instanceof UndefinedType) {
            return new ObjectProperty(property.getName(), propertyType, false);
        } else if (!(propType instanceof UnionType)) {
            return property;
        }

        const { newType: newPropType, numRemoved } = removeUndefined(propType);

        if (numRemoved == 0) {
            return property;
        }

        return new ObjectProperty(property.getName(), preserveAnnotation(propertyType!, newPropType), false);
    }
}
