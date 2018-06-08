import { Config } from "../Config";
import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { BaseType } from "../Type/BaseType";
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
        const tupleDefinitions = type.getTypes().map((item) => this.childTypeFormatter.getDefinition(item));
        const addAdditionalItems = tupleDefinitions.length > 1 && !this.config.strictTuples;
        const additionalItems = {additionalItems: {anyOf: tupleDefinitions}};
        return {
            type: "array",
            items: tupleDefinitions,
            minItems: tupleDefinitions.length,
            ...(addAdditionalItems ? additionalItems : {maxItems: tupleDefinitions.length}),
        };
    }
    public getChildren(type: TupleType): BaseType[] {
        return type.getTypes().reduce((result: BaseType[], item) => [
            ...result,
            ...this.childTypeFormatter.getChildren(item),
        ], []);
    }
}
