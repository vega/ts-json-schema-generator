import { Definition } from "../Schema/Definition.js";
import { SubTypeFormatter } from "../SubTypeFormatter.js";
import { AnyType } from "../Type/AnyType.js";
import { SymbolType } from "../Type/SymbolType.js";
import { BaseType } from "../Type/BaseType.js";
import { ObjectProperty, ObjectType } from "../Type/ObjectType.js";
import { UndefinedType } from "../Type/UndefinedType.js";
import { UnionType } from "../Type/UnionType.js";
import { TypeFormatter } from "../TypeFormatter.js";
import { getAllOfDefinitionReducer } from "../Utils/allOfDefinition.js";
import { derefType } from "../Utils/derefType.js";
import { preserveAnnotation } from "../Utils/preserveAnnotation.js";
import { removeUndefined } from "../Utils/removeUndefined.js";
import { StringMap } from "../Utils/StringMap.js";
import { uniqueArray } from "../Utils/uniqueArray.js";
import { NeverType } from "../Type/NeverType.js";

export class ObjectTypeFormatter implements SubTypeFormatter {
    public constructor(protected childTypeFormatter: TypeFormatter) {}

    public supportsType(type: BaseType): boolean {
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
                [],
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
                (property) => !(derefType(property.getType()) instanceof NeverType),
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

        return new ObjectProperty(property.getName(), preserveAnnotation(propertyType, newPropType), false);
    }
}
