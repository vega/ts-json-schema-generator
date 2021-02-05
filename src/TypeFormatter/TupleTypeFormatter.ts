import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { BaseType } from "../Type/BaseType";
import { OptionalType } from "../Type/OptionalType";
import { RestType } from "../Type/RestType";
import { TupleType } from "../Type/TupleType";
import { TypeFormatter } from "../TypeFormatter";
import { uniqueArray } from "../Utils/uniqueArray";

export class TupleTypeFormatter implements SubTypeFormatter {
    public constructor(private childTypeFormatter: TypeFormatter) {}

    public supportsType(type: TupleType): boolean {
        return type instanceof TupleType;
    }
    public getDefinition(type: TupleType): Definition {
        const subTypes = type.getTypes();

        const requiredElements = subTypes.filter((t) => !(t instanceof OptionalType) && !(t instanceof RestType));
        const optionalElements = subTypes.filter((t) => t instanceof OptionalType) as OptionalType[];
        const restElements = subTypes.filter((t) => t instanceof RestType) as RestType[];
        const restType = restElements.length ? restElements[0].getType().getItem() : undefined;

        // When the tuple is of the form [A, A, A], [A, A, A?], or [A, A, A, ...A[]],
        // generate a simple array with minItems (and possibly maxItems) instead.
        const isUniformArray =
            requiredElements.length > 0 &&
            requiredElements.slice(1).every((item) => item.getId() === requiredElements[0].getId()) &&
            optionalElements.every((item) => item.getType().getId() === requiredElements[0].getId()) &&
            (restElements.length === 0 ||
                (restElements.length === 1 && restType?.getId() === requiredElements[0].getId()));

        if (isUniformArray) {
            return {
                type: "array",
                items: this.childTypeFormatter.getDefinition(requiredElements[0]),
                minItems: requiredElements.length,
                ...(restType ? {} : { maxItems: requiredElements.length + optionalElements.length }),
            };
        }

        const requiredDefinitions = requiredElements.map((item) => this.childTypeFormatter.getDefinition(item));
        const optionalDefinitions = optionalElements.map((item) => this.childTypeFormatter.getDefinition(item));
        const itemsTotal = requiredDefinitions.length + optionalDefinitions.length;
        const restDefinition = restType ? this.childTypeFormatter.getDefinition(restType) : undefined;

        return {
            type: "array",
            minItems: requiredDefinitions.length,
            ...(itemsTotal ? { items: requiredDefinitions.concat(optionalDefinitions) } : {}), // with items
            ...(!itemsTotal && restDefinition ? { items: restDefinition } : {}), // with only rest param
            ...(!itemsTotal && !restDefinition ? { maxItems: 0 } : {}), // empty
            ...(restDefinition && itemsTotal ? { additionalItems: restDefinition } : {}), // with items and rest
            ...(!restDefinition && itemsTotal ? { maxItems: itemsTotal } : {}), // without rest
        };
    }
    public getChildren(type: TupleType): BaseType[] {
        return uniqueArray(
            type
                .getTypes()
                .reduce((result: BaseType[], item) => [...result, ...this.childTypeFormatter.getChildren(item)], [])
        );
    }
}
