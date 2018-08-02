import { Config } from "../Config";
import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { BaseType } from "../Type/BaseType";
import { OptionalType } from "../Type/OptionalType";
import { RestType } from "../Type/RestType";
import { TupleType } from "../Type/TupleType";
import { TypeFormatter } from "../TypeFormatter";

export class TupleTypeFormatter implements SubTypeFormatter {
    public constructor(
        private childTypeFormatter: TypeFormatter,
        private config: Config,
    ) {
    }

    public supportsType(type: TupleType): boolean {
        return type instanceof TupleType;
    }
    public getDefinition(type: TupleType): Definition {
        const subTypes = type.getTypes();

        const requiredElements = subTypes.filter(t => !(t instanceof OptionalType) && !(t instanceof RestType));
        const optionalElements  = subTypes.filter(t => t instanceof OptionalType) as OptionalType[];
        const restElements = subTypes.filter(t => t instanceof RestType) as RestType[];

        const requiredDefinitions = requiredElements.map((item) => this.childTypeFormatter.getDefinition(item));
        const optionalDefinitions = optionalElements.map((item) => this.childTypeFormatter.getDefinition(item));
        const itemsTotal = requiredDefinitions.length + optionalDefinitions.length;

        const restType = restElements.length ? restElements[0].getType().getItem() : undefined;
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
        return type.getTypes().reduce((result: BaseType[], item) => [
            ...result,
            ...this.childTypeFormatter.getChildren(item),
        ], []);
    }
}
