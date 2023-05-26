import { JSONSchema7 } from "json-schema";
import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { BaseType } from "../Type/BaseType";
import { LiteralType } from "../Type/LiteralType";
import { NeverType } from "../Type/NeverType";
import { UnionType } from "../Type/UnionType";
import { TypeFormatter } from "../TypeFormatter";
import { derefType } from "../Utils/derefType";
import { getTypeByKey } from "../Utils/typeKeys";
import { uniqueArray } from "../Utils/uniqueArray";

type DiscriminatorType = "json-schema" | "open-api";

export class UnionTypeFormatter implements SubTypeFormatter {
    public constructor(protected childTypeFormatter: TypeFormatter, private discriminatorType?: DiscriminatorType) {}

    public supportsType(type: UnionType): boolean {
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
        if (!discriminator) throw new Error("discriminator is undefined");
        const kindTypes = type
            .getTypes()
            .filter((item) => !(derefType(item) instanceof NeverType))
            .map((item) => getTypeByKey(item, new LiteralType(discriminator)));

        const undefinedIndex = kindTypes.findIndex((item) => item === undefined);

        if (undefinedIndex != -1) {
            throw new Error(
                `Cannot find discriminator keyword "${discriminator}" in type ${JSON.stringify(
                    type.getTypes()[undefinedIndex]
                )}.`
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
            throw new Error(
                `Duplicate discriminator values: ${duplicates.join(", ")} in type ${JSON.stringify(type.getName())}.`
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
        if (!discriminator) throw new Error("discriminator is undefined");
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

        // TODO: why is this not covered by LiteralUnionTypeFormatter?
        // special case for string literals | string -> string
        let stringType = true;
        let oneNotEnum = false;
        for (const def of definitions) {
            if (def.type !== "string") {
                stringType = false;
                break;
            }
            if (def.enum === undefined) {
                oneNotEnum = true;
            }
        }
        if (stringType && oneNotEnum) {
            const values = [];
            for (const def of definitions) {
                if (def.enum) {
                    values.push(...def.enum);
                } else if (def.const) {
                    values.push(def.const);
                } else {
                    return {
                        type: "string",
                    };
                }
            }
            return {
                type: "string",
                enum: values,
            };
        }

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
                .reduce((result: BaseType[], item) => [...result, ...this.childTypeFormatter.getChildren(item)], [])
        );
    }
}
