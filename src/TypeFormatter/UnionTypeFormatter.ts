import { JSONSchema7 } from "json-schema";
import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { BaseType } from "../Type/BaseType";
import { UnionType } from "../Type/UnionType";
import { TypeFormatter } from "../TypeFormatter";
import { uniqueArray } from "../Utils/uniqueArray";

export class UnionTypeFormatter implements SubTypeFormatter {
    public constructor(private childTypeFormatter: TypeFormatter) {}

    public supportsType(type: UnionType): boolean {
        return type instanceof UnionType;
    }
    public getDefinition(type: UnionType): Definition {
        const definitions = type.getTypes().map((item) => this.childTypeFormatter.getDefinition(item));

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
            return {
                type: "string",
            };
        }

        const flattenedDefinitions: JSONSchema7[] = [];

        // Flatten anyOf inside anyOf unless the anyOf has an annotation
        for (const def of definitions) {
            const keys = Object.keys(def);
            if (keys.length === 1 && keys[0] === "anyOf") {
                flattenedDefinitions.push(...(def.anyOf as any));
            } else if (keys.length > 0) {
                flattenedDefinitions.push(def);
            } else {
                // skip adding empty elements to flattendedDefinitions
                // "never" types return an empty def
                continue;
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
