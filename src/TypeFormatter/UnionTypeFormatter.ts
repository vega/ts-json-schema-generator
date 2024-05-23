import { JSONSchema7 } from "json-schema";
import { Definition } from "../Schema/Definition.js";
import { SubTypeFormatter } from "../SubTypeFormatter.js";
import { BaseType } from "../Type/BaseType.js";
import { LiteralType } from "../Type/LiteralType.js";
import { NeverType } from "../Type/NeverType.js";
import { UnionType } from "../Type/UnionType.js";
import { TypeFormatter } from "../TypeFormatter.js";
import { derefType } from "../Utils/derefType.js";
import { getTypeByKey } from "../Utils/typeKeys.js";
import { uniqueArray } from "../Utils/uniqueArray.js";
import { JsonTypeError } from "../Error/Errors.js";

type DiscriminatorType = "json-schema" | "open-api";

export class UnionTypeFormatter implements SubTypeFormatter {
    public constructor(
        protected childTypeFormatter: TypeFormatter,
        private discriminatorType?: DiscriminatorType,
    ) {}

    public supportsType(type: BaseType): boolean {
        return type instanceof UnionType;
    }
    private getTypeDefinitions(type: UnionType) {
        return type
            .getTypes()
            .filter((item) => !(derefType(item) instanceof NeverType))
            .map((item) => this.childTypeFormatter.getDefinition(item));
    }

    private getJsonSchemaDiscriminatorDefinition(type: UnionType): Definition {
        const definitions = this.getTypeDefinitions(type);
        const discriminator = type.getDiscriminator();

        if (!discriminator) {
            throw new JsonTypeError("discriminator is undefined", type);
        }

        const kindTypes = type
            .getTypes()
            .filter((item) => !(derefType(item) instanceof NeverType))
            .map((item) => getTypeByKey(item, new LiteralType(discriminator)));

        const undefinedIndex = kindTypes.findIndex((item) => item === undefined);

        if (undefinedIndex !== -1) {
            throw new JsonTypeError(
                `Cannot find discriminator keyword "${discriminator}" in type ${type.getTypes()[undefinedIndex].getName()}.`,
                type,
            );
        }

        const kindDefinitions = kindTypes.map((item) => this.childTypeFormatter.getDefinition(item as BaseType));

        const allOf = [];

        for (let i = 0; i < definitions.length; i++) {
            allOf.push({
                if: {
                    properties: { [discriminator]: kindDefinitions[i] },
                },
                then: definitions[i],
            });
        }

        const kindValues = kindDefinitions
            .flatMap((item) => item.const ?? item.enum)
            .filter((item): item is string | number | boolean | null => item !== undefined);

        const duplicates = kindValues.filter((item, index) => kindValues.indexOf(item) !== index);
        if (duplicates.length > 0) {
            throw new JsonTypeError(
                `Duplicate discriminator values: ${duplicates.join(", ")} in type ${JSON.stringify(type.getName())}.`,
                type,
            );
        }

        const properties = {
            [discriminator]: {
                enum: kindValues,
            },
        };

        return { type: "object", properties, required: [discriminator], allOf };
    }
    private getOpenApiDiscriminatorDefinition(type: UnionType): Definition {
        const oneOf = this.getTypeDefinitions(type);
        const discriminator = type.getDiscriminator();

        if (!discriminator) {
            throw new JsonTypeError("discriminator is undefined", type);
        }

        return {
            type: "object",
            discriminator: { propertyName: discriminator },
            required: [discriminator],
            oneOf,
        } as JSONSchema7;
    }
    public getDefinition(type: UnionType): Definition {
        const discriminator = type.getDiscriminator();
        if (discriminator !== undefined) {
            if (this.discriminatorType === "open-api") return this.getOpenApiDiscriminatorDefinition(type);
            return this.getJsonSchemaDiscriminatorDefinition(type);
        }

        const definitions = this.getTypeDefinitions(type);

        const flattenedDefinitions: JSONSchema7[] = [];

        // Flatten anyOf inside anyOf unless the anyOf has an annotation
        for (const def of definitions) {
            const keys = Object.keys(def);

            if (keys.length === 1 && keys[0] === "anyOf") {
                flattenedDefinitions.push(...(def.anyOf as any));
            } else {
                flattenedDefinitions.push(def);
            }
        }

        return flattenedDefinitions.length > 1
            ? {
                  anyOf: flattenedDefinitions,
              }
            : flattenedDefinitions[0];
    }
    public getChildren(type: UnionType): BaseType[] {
        return uniqueArray(
            type
                .getTypes()
                .reduce((result: BaseType[], item) => [...result, ...this.childTypeFormatter.getChildren(item)], []),
        );
    }
}
