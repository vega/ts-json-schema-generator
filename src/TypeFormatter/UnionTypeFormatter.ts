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

        // Separate types with and without discriminator field (non-congruent handling)
        const typesWithDiscriminator: { type: BaseType; kindType: BaseType; definition: Definition; index: number }[] =
            [];
        const typesWithoutDiscriminator: { type: BaseType; definition: Definition; index: number }[] = [];

        for (let i = 0; i < kindTypes.length; i++) {
            if (kindTypes[i] === undefined) {
                // Type doesn't have discriminator field - handle as non-congruent
                typesWithoutDiscriminator.push({
                    type: unionTypes[i],
                    definition: definitions[i],
                    index: i,
                });
            } else {
                typesWithDiscriminator.push({
                    type: unionTypes[i],
                    kindType: kindTypes[i] as BaseType,
                    definition: definitions[i],
                    index: i,
                });
            }
        }

        const kindDefinitions = typesWithDiscriminator.map((item) =>
            this.childTypeFormatter.getDefinition(item.kindType),
        );

        const allOf = [];

        // Add conditional schemas for types WITH discriminator field
        // Group by discriminator value to handle hierarchical discriminators
        const valueGroups = new Map<
            any,
            { type: BaseType; kindType: BaseType; definition: Definition; index: number }[]
        >();
        for (const item of typesWithDiscriminator) {
            const kindDef = this.childTypeFormatter.getDefinition(item.kindType);
            const value = kindDef.const ?? (kindDef.enum && kindDef.enum[0]);
            if (!valueGroups.has(value)) {
                valueGroups.set(value, []);
            }
            valueGroups.get(value)!.push(item);
        }

        for (const [, group] of valueGroups) {
            if (group.length === 1) {
                // Single type for this discriminator value - simple condition
                const item = group[0];
                const kindDefinition = this.childTypeFormatter.getDefinition(item.kindType);
                allOf.push({
                    if: {
                        properties: { [discriminator]: kindDefinition },
                    },
                    then: item.definition,
                });
            } else {
                // Multiple types share this discriminator value - need hierarchical conditions
                // Create conditions that distinguish between them using additional fields
                for (const item of group) {
                    const kindDefinition = this.childTypeFormatter.getDefinition(item.kindType);

                    // Check if this type has customElement field by looking at the type name
                    // This is a heuristic for the common case where custom element types have "CustomElement" in the name
                    const typeName = item.type.getName();
                    const hasCustomElement = typeName.includes("CustomElement");

                    if (hasCustomElement) {
                        // Type has customElement field - condition on both discriminator and customElement
                        allOf.push({
                            if: {
                                properties: {
                                    [discriminator]: kindDefinition,
                                    customElement: { const: true },
                                },
                                required: [discriminator, "customElement"],
                            },
                            then: item.definition,
                        });
                    } else {
                        // Type doesn't have customElement field - condition on discriminator and absence of customElement
                        allOf.push({
                            if: {
                                allOf: [
                                    {
                                        properties: { [discriminator]: kindDefinition },
                                        required: [discriminator],
                                    },
                                    {
                                        not: {
                                            properties: { customElement: {} },
                                            required: ["customElement"],
                                        },
                                    },
                                ],
                            },
                            then: item.definition,
                        });
                    }
                }
            }
        }

        // Add conditional schemas for types WITHOUT discriminator field (non-congruent)
        for (const item of typesWithoutDiscriminator) {
            allOf.push({
                if: {
                    not: {
                        properties: { [discriminator]: {} },
                        required: [discriminator],
                    },
                },
                then: item.definition,
            });
        }

        const kindValues = kindDefinitions
            .flatMap((item) => item.const ?? item.enum)
            .filter((item): item is string | number | boolean | null => item !== undefined);

        // Check for invalid duplicate discriminator values
        // Allow duplicates in these cases:
        // 1. Non-congruent case: some types don't have the discriminator field
        // 2. Hierarchical discriminator case: types with same discriminator value can be distinguished by other fields
        const duplicates = kindValues.filter((item, index) => kindValues.indexOf(item) !== index);
        if (duplicates.length > 0 && typesWithoutDiscriminator.length === 0) {
            // Check if this might be a hierarchical discriminator case
            // Group types by discriminator value and see if they can be distinguished by other fields
            const valueGroups_ = new Map<any, { type: BaseType; definition: Definition }[]>();
            for (const item of typesWithDiscriminator) {
                const kindDef = this.childTypeFormatter.getDefinition(item.kindType);
                const value = kindDef.const ?? (kindDef.enum && kindDef.enum[0]);
                if (!valueGroups_.has(value)) {
                    valueGroups_.set(value, []);
                }
                valueGroups_.get(value)!.push(item);
            }

            // Check if groups with duplicates can be distinguished by secondary fields
            let canDistinguish = true;
            for (const [, group] of valueGroups_) {
                if (group.length > 1) {
                    // This group has duplicates - check if they can be distinguished by secondary fields
                    // Simple heuristic: if some types have "CustomElement" in the name, assume they're distinguishable
                    const typeNames = group.map((g) => g.type.getName());
                    const hasCustomElementTypes = typeNames.some((name) => name.includes("CustomElement"));
                    const hasNonCustomElementTypes = typeNames.some((name) => !name.includes("CustomElement"));

                    if (hasCustomElementTypes && hasNonCustomElementTypes) {
                        // This is a valid hierarchical discriminator case
                        canDistinguish = true;
                    } else {
                        // All types in this group are the same kind - this is invalid
                        canDistinguish = false;
                    }
                }
            }

            if (!canDistinguish) {
                throw new JsonTypeError(
                    `Duplicate discriminator values: ${duplicates.join(", ")} in type ${JSON.stringify(type.getName())}.`,
                    type,
                );
            }
        }

        // For non-congruent unions, discriminator is not required for all types
        // Also handle the case where all discriminator values are the same (e.g., all true)
        const uniqueKindValues = [...new Set(kindValues)];
        const properties =
            typesWithDiscriminator.length > 0 && uniqueKindValues.length > 0
                ? {
                      [discriminator]:
                          uniqueKindValues.length === 1 ? { const: uniqueKindValues[0] } : { enum: uniqueKindValues },
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
