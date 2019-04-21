import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { BaseType } from "../Type/BaseType";
import { IntersectionType } from "../Type/IntersectionType";
import { ObjectType } from "../Type/ObjectType";
import { TypeFormatter } from "../TypeFormatter";
import { getAllOfDefinitionReducer } from "../Utils/allOfDefinition";

export class IntersectionTypeFormatter implements SubTypeFormatter {
    public constructor(
        private childTypeFormatter: TypeFormatter,
    ) {
    }

    public supportsType(type: IntersectionType): boolean {
        return type instanceof IntersectionType;
    }
    public getDefinition(type: IntersectionType): Definition {
        const types = type.getTypes();

        // FIXME: when we have union types as children, we have to translate.
        // See https://github.com/vega/ts-json-schema-generator/issues/62

        return types.length > 1 ? types.reduce(
            getAllOfDefinitionReducer(this.childTypeFormatter),
            {type: "object", additionalProperties: false} as Definition)
            : this.childTypeFormatter.getDefinition(types[0]);
    }
    public getChildren(type: IntersectionType): BaseType[] {
        return type.getTypes().reduce((result: BaseType[], item) => {
            // Remove the first child, which is the definition of the child itself because we are merging objects.
            // However, if the child is just a reference, we cannot remove it.
            const slice = item instanceof ObjectType ? 0 : 1;
            return [
                ...result,
                ...this.childTypeFormatter.getChildren(item).slice(slice),
            ];
        }, []);
    }
}
