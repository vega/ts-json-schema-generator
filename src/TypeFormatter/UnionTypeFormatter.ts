import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { BaseType } from "../Type/BaseType";
import { UnionType } from "../Type/UnionType";
import { TypeFormatter } from "../TypeFormatter";
import { uniqueArray } from "../Utils/uniqueArray";

export class UnionTypeFormatter implements SubTypeFormatter {
    public constructor(
        private childTypeFormatter: TypeFormatter,
    ) {
    }

    public supportsType(type: UnionType): boolean {
        return type instanceof UnionType;
    }
    public getDefinition(type: UnionType): Definition {
        const definitions = type.getTypes().map((item) => this.childTypeFormatter.getDefinition(item));

        return definitions.length > 1 ? {
            anyOf: definitions,
        } : definitions[0];
    }
    public getChildren(type: UnionType): BaseType[] {
        return type.getTypes().reduce((result: BaseType[], item) => [
            ...result,
            ...this.childTypeFormatter.getChildren(item),
        ], []);
    }
}
