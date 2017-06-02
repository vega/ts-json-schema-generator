import { TypeFormatter } from "../TypeFormatter";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { ObjectType, ObjectProperty } from "../Type/ObjectType";
import { BaseType } from "../Type/BaseType";
import { Definition } from "../Schema/Definition";
import { Map } from "../Utils/Map";
import { getAllOfDefinitionReducer } from "../Utils/allOfDefinition";

export class ObjectTypeFormatter implements SubTypeFormatter {
    public constructor(
        private childTypeFormatter: TypeFormatter,
    ) {
    }

    public supportsType(type: ObjectType): boolean {
        return type instanceof ObjectType;
    }
    public getDefinition(type: ObjectType): Definition {
        if (!type.getBaseTypes().length) {
            return this.getObjectDefinition(type);
        }

        if (
            Object.keys(type.getProperties()).length === 0 &&
            type.getAdditionalProperties() === false &&
            type.getBaseTypes().length === 1
        ) {
            return this.childTypeFormatter.getDefinition(type.getBaseTypes()[0]);
        }

        return type.getBaseTypes().reduce(
            getAllOfDefinitionReducer(this.childTypeFormatter), this.getObjectDefinition(type));
    }
    public getChildren(type: ObjectType): BaseType[] {
        const properties: ObjectProperty[] = type.getProperties();
        const additionalProperties: BaseType|false = type.getAdditionalProperties();

        return [
            ...type.getBaseTypes().reduce((result: BaseType[], baseType: BaseType) => [
                ...result,
                ...this.childTypeFormatter.getChildren(baseType),
            ], []),

            ...additionalProperties instanceof BaseType ?
                this.childTypeFormatter.getChildren(additionalProperties) :
                [],

            ...properties.reduce((result: BaseType[], property: ObjectProperty) => [
                ...result,
                ...this.childTypeFormatter.getChildren(property.getType()),
            ], []),
        ];
    }

    private getObjectDefinition(type: ObjectType): Definition {
        const properties: ObjectProperty[] = type.getProperties();
        const additionalProperties: BaseType|false = type.getAdditionalProperties();

        const required: string[] = properties
            .filter((property: ObjectProperty) => property.isRequired())
            .map((property: ObjectProperty) => property.getName());
        return {
            type: "object",
            properties: properties.reduce((result: Map<Definition>, property: ObjectProperty) => {
                result[property.getName()] = this.childTypeFormatter.getDefinition(property.getType());
                return result;
            }, {}),
            ...(required.length > 0 ? {required} : {}),
            additionalProperties: additionalProperties instanceof BaseType ?
                this.childTypeFormatter.getDefinition(additionalProperties) :
                additionalProperties,
        };
    }
}
