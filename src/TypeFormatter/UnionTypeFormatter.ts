import { JSONSchema7 } from "json-schema";
import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { BaseType } from "../Type/BaseType";
import { UnionType } from "../Type/UnionType";
import { TypeFormatter } from "../TypeFormatter";
import { mergeDefinitions } from "../Utils/mergeDefinitions";
import { uniqueArray } from "../Utils/uniqueArray";

export class UnionTypeFormatter implements SubTypeFormatter {
    public constructor(private childTypeFormatter: TypeFormatter) {}

    public supportsType(type: UnionType): boolean {
        return type instanceof UnionType;
    }
    public getDefinition(type: UnionType): Definition {
        const definitions = type.getTypes().map((item) => this.childTypeFormatter.getDefinition(item));

        const flattenedDefinitions: JSONSchema7[] = [];

        // Flatten anyOf inside anyOf unless the anyOf has an annotation
        for (const def of definitions) {
            if (Object.keys(def) === ["anyOf"]) {
                flattenedDefinitions.push(...(def.anyOf as any));
            } else {
                flattenedDefinitions.push(def);
            }
        }

        for (let idx = 0; idx < flattenedDefinitions.length - 1; idx++) {
            for (let comp = idx + 1; comp < flattenedDefinitions.length; ) {
                const merged = mergeDefinitions(flattenedDefinitions[idx], flattenedDefinitions[comp]);
                if (merged) {
                    flattenedDefinitions[idx] = merged;
                    flattenedDefinitions.splice(comp, 1);
                } else {
                    comp++;
                }
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
