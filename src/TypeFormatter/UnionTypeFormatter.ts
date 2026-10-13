import type { JSONSchema7 } from "json-schema";
import type { Definition } from "../Schema/Definition.js";
import type { SubTypeFormatter } from "../SubTypeFormatter.js";
import type { BaseType } from "../Type/BaseType.js";
import { LiteralType } from "../Type/LiteralType.js";
import { NeverType } from "../Type/NeverType.js";
import { UnionType } from "../Type/UnionType.js";
import type { TypeFormatter } from "../TypeFormatter.js";
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

        const unionTypes = type.getTypes().filter((item) => !(derefType(item) instanceof NeverType));
        const kindTypes = unionTypes.map((item) => getTypeByKey(item, new LiteralType(discriminator)));

        // Separate types with and without discriminator field (non-congruent support)
        const typesWithDiscriminator: { kindType: BaseType; definition: Definition }[] = [];
        const typesWithoutDiscriminator: { definition: Definition }[] = [];

        for (let i = 0; i < kindTypes.length; i++) {
            if (kindTypes[i] === undefined) {
                // Type doesn't have discriminator field
                typesWithoutDiscriminator.push({ definition: definitions[i] });
            } else {
                typesWithDiscriminator.push({
                    kindType: kindTypes[i] as BaseType,
                    definition: definitions[i],
                });
            }
        }

        const kindDefinitions = typesWithDiscriminator.map((item) =>
            this.childTypeFormatter.getDefinition(item.kindType),
        );

        const allOf = [];

        // Add conditional schemas for types WITH discriminator field
        for (let i = 0; i < typesWithDiscriminator.length; i++) {
            allOf.push({
                if: {
                    properties: { [discriminator]: kindDefinitions[i] },
                    required: [discriminator],
                },
                then: typesWithDiscriminator[i].definition,
            });
        }

        // Add conditional schemas for types WITHOUT discriminator field (non-congruent)
        if (typesWithoutDiscriminator.length > 0) {
            allOf.push({
                if: {
                    not: {
                        properties: { [discriminator]: {} },
                        required: [discriminator],
                    },
                },
                then:
                    typesWithoutDiscriminator.length === 1
                        ? typesWithoutDiscriminator[0].definition
                        : {
                              anyOf: typesWithoutDiscriminator.map((item) => item.definition),
                          },
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

        // Build properties only if we have types with discriminator
        const properties =
            kindValues.length > 0
                ? {
                      [discriminator]: {
                          enum: kindValues,
                      },
                  }
                : {};

        // Only require discriminator if all types have it
        const required = typesWithoutDiscriminator.length === 0 ? [discriminator] : [];

        return { type: "object", properties, required, allOf };
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
