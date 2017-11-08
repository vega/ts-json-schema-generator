import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { BaseType } from "../Type/BaseType";
import { UnionType } from "../Type/UnionType";
import { TypeFormatter } from "../TypeFormatter";

export class UnionTypeFormatter implements SubTypeFormatter {
    public constructor(
        private childTypeFormatter: TypeFormatter,
    ) {
    }

    public supportsType(type: UnionType): boolean {
        return type instanceof UnionType;
    }
    public getDefinition(type: UnionType): Definition {
        const definitions = type.getTypes().map((item: BaseType) => this.childTypeFormatter.getDefinition(item));
        return definitions.length > 1 ? {
            anyOf: definitions,
        } : definitions[0];
    }
    public getChildren(type: UnionType): BaseType[] {
        return type.getTypes().reduce((result: BaseType[], item: BaseType) => [
            ...result,
            ...this.childTypeFormatter.getChildren(item),
        ], []);
    }
}
