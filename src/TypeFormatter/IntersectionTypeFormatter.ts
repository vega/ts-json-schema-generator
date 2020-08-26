import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { BaseType } from "../Type/BaseType";
import { DefinitionType } from "../Type/DefinitionType";
import { IntersectionType } from "../Type/IntersectionType";
import { TypeFormatter } from "../TypeFormatter";
import { canReduceAllOfDefinition, getAllOfDefinitionReducer } from "../Utils/allOfDefinition";
import { uniqueArray } from "../Utils/uniqueArray";

export class IntersectionTypeFormatter implements SubTypeFormatter {
    public constructor(private childTypeFormatter: TypeFormatter) {}

    public supportsType(type: IntersectionType): boolean {
        return type instanceof IntersectionType;
    }

    public getDefinition(type: IntersectionType): Definition {
        const types = type.getTypes();

        // FIXME: when we have union types as children, we have to translate.
        // See https://github.com/vega/ts-json-schema-generator/issues/62

        if (types.length === 1) {
            return this.childTypeFormatter.getDefinition(types[0]);
        } else if (canReduceAllOfDefinition(this.childTypeFormatter, types)) {
            // combine object instead of using allOf because allOf does not work well with additional properties
            return types.reduce(getAllOfDefinitionReducer(this.childTypeFormatter), {
                type: "object",
                additionalProperties: false,
            } as Definition);
        } else {
            return {
                allOf: types.map((typeItem) => this.childTypeFormatter.getDefinition(typeItem)),
            };
        }
    }

    public getChildren(type: IntersectionType): BaseType[] {
        const types = type.getTypes();
        if (types.length === 1) {
            return this.childTypeFormatter.getChildren(types[0]);
        } else if (canReduceAllOfDefinition(this.childTypeFormatter, types)) {
            return uniqueArray(
                types.reduce((result: BaseType[], item) => {
                    // Remove the first child, which is the definition of the child itself
                    // because we are merging objects.
                    // However, if the child is just a reference, we cannot remove it.
                    const slice = item instanceof DefinitionType ? 1 : 0;
                    return [...result, ...this.childTypeFormatter.getChildren(item).slice(slice)];
                }, [])
            );
        } else {
            return uniqueArray(
                types.reduce((result: BaseType[], item) => {
                    return [...result, ...this.childTypeFormatter.getChildren(item)];
                }, [])
            );
        }
    }
}
