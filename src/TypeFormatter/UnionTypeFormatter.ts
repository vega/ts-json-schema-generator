import {JSONSchema7, JSONSchema7Array, JSONSchema7Object} from "json-schema";
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

export class UnionTypeFormatter implements SubTypeFormatter {
    public constructor(protected childTypeFormatter: TypeFormatter) {}

    public supportsType(type: UnionType): boolean {
        return type instanceof UnionType;
    }
    public getDefinition(type: UnionType): Definition {
        const definitions = type
            .getTypes()
            .filter((item) => !(derefType(item) instanceof NeverType))
            .map((item) => this.childTypeFormatter.getDefinition(item));

        const discriminator = type.getDiscriminator();
        if (discriminator !== undefined) {
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
                .map((item) => item.const)
                .filter((item): item is string | number | boolean | null => item !== undefined);

            const properties = {
                [discriminator]: {
                    enum: kindValues,
                },
            };

            return { type: "object", properties, required: [discriminator], allOf };
        }

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
