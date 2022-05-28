import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { ArrayType } from "../Type/ArrayType";
import { BaseType } from "../Type/BaseType";
import { OptionalType } from "../Type/OptionalType";
import { RestType } from "../Type/RestType";
import { TupleType } from "../Type/TupleType";
import { TypeFormatter } from "../TypeFormatter";
import { notUndefined } from "../Utils/notUndefined";
import { uniqueArray } from "../Utils/uniqueArray";

export class TupleTypeFormatter implements SubTypeFormatter {
    public constructor(protected childTypeFormatter: TypeFormatter) {}

    public supportsType(type: BaseType): boolean {
        return type instanceof TupleType;
    }

    public getDefinition(type: TupleType): Definition {
        const subTypes = type.getTypes().filter(notUndefined);

        const requiredElements = subTypes.filter((t) => !(t instanceof OptionalType) && !(t instanceof RestType));
        const optionalElements = subTypes.filter((t): t is OptionalType => t instanceof OptionalType);
        // NOTE: A maximum of one rest type is assumed.
        const restType = subTypes.find((t): t is RestType => t instanceof RestType);
        const firstItemType = requiredElements.length > 0 ? requiredElements[0] : optionalElements[0]?.getType();

        function uniformRestType(type: RestType): boolean {
            const inner = type.getType();
            return (
                (inner instanceof ArrayType && inner.getItem().getId() === firstItemType.getId()) ||
                (inner instanceof TupleType &&
                    inner.getTypes().every((tuple_type) => {
                        if (tuple_type instanceof RestType) {
                            return uniformRestType(tuple_type);
                        } else {
                            return tuple_type?.getId() === firstItemType.getId();
                        }
                    }))
            );
        }

        // Check whether the tuple is of any of the following forms:
        //   [A, A, A]
        //   [A, A, A?]
        //   [A?, A?]
        //   [A, A, A, ...A[]],
        const isUniformArray =
            firstItemType &&
            requiredElements.every((item) => item.getId() === firstItemType.getId()) &&
            optionalElements.every((item) => item.getType().getId() === firstItemType.getId()) &&
            (!restType || uniformRestType(restType));

        // If so, generate a simple array with minItems (and possibly maxItems) instead.
        if (isUniformArray) {
            return {
                type: "array",
                items: this.childTypeFormatter.getDefinition(firstItemType),
                minItems: requiredElements.length,
                ...(restType ? {} : { maxItems: requiredElements.length + optionalElements.length }),
            };
        }

        const requiredDefinitions = requiredElements.map((item) => this.childTypeFormatter.getDefinition(item));
        const optionalDefinitions = optionalElements.map((item) => this.childTypeFormatter.getDefinition(item));
        const itemsTotal = requiredDefinitions.length + optionalDefinitions.length;
        const additionalItems = restType ? this.childTypeFormatter.getDefinition(restType).items : undefined;

        return {
            type: "array",
            minItems: requiredDefinitions.length,
            ...(itemsTotal ? { items: requiredDefinitions.concat(optionalDefinitions) } : {}), // with items
            ...(!itemsTotal && additionalItems ? { items: additionalItems } : {}), // with only rest param
            ...(!itemsTotal && !additionalItems ? { maxItems: 0 } : {}), // empty
            ...(additionalItems && !Array.isArray(additionalItems) && itemsTotal
                ? { additionalItems: additionalItems }
                : {}), // with rest items
            ...(!additionalItems && itemsTotal ? { maxItems: itemsTotal } : {}), // without rest
        };
    }

    public getChildren(type: TupleType): BaseType[] {
        return uniqueArray(
            type
                .getTypes()
                .filter(notUndefined)
                .reduce((result: BaseType[], item) => [...result, ...this.childTypeFormatter.getChildren(item)], [])
        );
    }
}
