import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { AnyType } from "../Type/AnyType";
import { BaseType } from "../Type/BaseType";
import { ObjectProperty, ObjectType } from "../Type/ObjectType";
import { UndefinedType } from "../Type/UndefinedType";
import { UnionType } from "../Type/UnionType";
import { TypeFormatter } from "../TypeFormatter";
import { getAllOfDefinitionReducer } from "../Utils/allOfDefinition";
import { StringMap } from "../Utils/StringMap";

export class ObjectTypeFormatter implements SubTypeFormatter {
    public constructor(
        private childTypeFormatter: TypeFormatter,
    ) {
    }

    public supportsType(type: ObjectType): boolean {
        return type instanceof ObjectType;
    }
    public getDefinition(type: ObjectType): Definition {
        if (type.getBaseTypes().length === 0) {
            return this.getObjectDefinition(type);
        }

        return type.getBaseTypes().reduce(
            getAllOfDefinitionReducer(this.childTypeFormatter), this.getObjectDefinition(type));
    }
    public getChildren(type: ObjectType): BaseType[] {
        const properties: ObjectProperty[] = type.getProperties();
        const additionalProperties: BaseType | boolean = type.getAdditionalProperties();

        return [
            ...type.getBaseTypes().reduce((result: BaseType[], baseType: BaseType) => [
                ...result,
                ...this.childTypeFormatter.getChildren(baseType).slice(1),
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
        const objectProperties: ObjectProperty[] = type.getProperties();
        const additionalProperties: BaseType|boolean = type.getAdditionalProperties();

        const required = objectProperties
            .map((property: ObjectProperty) => this.prepareObjectProperty(property))
            .filter((property: ObjectProperty) => property.isRequired())
            .map((property: ObjectProperty) => property.getName());
        const properties = objectProperties
            .map((property: ObjectProperty) => this.prepareObjectProperty(property))
            .reduce((result: StringMap<Definition>, property: ObjectProperty) => ({
                ...result,
                [property.getName()]: this.childTypeFormatter.getDefinition(property.getType()),
            }), {});

        return {
            type: "object",
            ...(Object.keys(properties).length > 0 ? {properties} : {}),
            ...(required.length > 0 ? {required} : {}),
            ...(additionalProperties === true || additionalProperties instanceof AnyType ? {} :
                {additionalProperties: additionalProperties instanceof BaseType ?
                    this.childTypeFormatter.getDefinition(additionalProperties) :
                    additionalProperties}),
        };
    }
    private getAdditionalProperties(additionalProperties: BaseType | boolean): Definition {
        if (typeof additionalProperties === "boolean") {
            return additionalProperties ? {} : {additionalProperties: false};
        }

        return additionalProperties instanceof AnyType
            ? {}
            : {additionalProperties: this.childTypeFormatter.getDefinition(additionalProperties)};
    }

    private prepareObjectProperty(property: ObjectProperty): ObjectProperty {
        const propType = property.getType();
        if (propType instanceof UndefinedType) {
            return new ObjectProperty(property.getName(), new UndefinedType(), false);
        } else if (!(propType instanceof UnionType)) {
            return property;
        }

        const requiredTypes = propType.getTypes().filter((it: BaseType) => !(it instanceof UndefinedType));
        if (propType.getTypes().length === requiredTypes.length) {
            return property;
        } else if (requiredTypes.length === 0) {
            return new ObjectProperty(property.getName(), new UndefinedType(), false);
        }

        return new ObjectProperty(
            property.getName(),
            requiredTypes.length === 1 ? requiredTypes[0] : new UnionType(requiredTypes),
            false,
        );
    }
}
