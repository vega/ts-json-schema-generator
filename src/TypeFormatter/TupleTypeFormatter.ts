import { TypeFormatter } from "../TypeFormatter";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { TupleType } from "../Type/TupleType";
import { BaseType } from "../Type/BaseType";
import { Definition } from "../Schema/Definition";

export class TupleTypeFormatter implements SubTypeFormatter {
    public constructor(
        private childTypeFormatter: TypeFormatter,
    ) {
    }

    public supportsType(type: TupleType): boolean {
        return type instanceof TupleType;
    }
    public getDefinition(type: TupleType): Definition {
        const tupleDefinitions: Definition[] = type.getTypes()
            .map((item: BaseType) => this.childTypeFormatter.getDefinition(item));

        return {
            type: "array",
            items: tupleDefinitions,
            minItems: tupleDefinitions.length,
            additionalItems: {anyOf: tupleDefinitions},
        };
    }
    public getChildren(type: TupleType): BaseType[] {
        return type.getTypes().reduce((result: BaseType[], item: BaseType) => [
            ...result,
            ...this.childTypeFormatter.getChildren(item),
        ], []);
    }
}
