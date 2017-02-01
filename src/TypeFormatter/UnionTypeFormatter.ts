import { TypeFormatter } from "../TypeFormatter";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { UnionType } from "../Type/UnionType";
import { BaseType } from "../Type/BaseType";
import { Definition } from "../Schema/Definition";

export class UnionTypeFormatter implements SubTypeFormatter {
    public constructor(
        private childTypeFormatter: TypeFormatter,
    ) {
    }

    public supportsType(type: UnionType): boolean {
        return type instanceof UnionType;
    }
    public getDefinition(type: UnionType): Definition {
        return {
            anyOf: type.getTypes().map((item: BaseType) => this.childTypeFormatter.getDefinition(item)),
        };
    }
    public getChildren(type: UnionType): BaseType[] {
        return type.getTypes().reduce((result: BaseType[], item: BaseType) => [
            ...result,
            ...this.childTypeFormatter.getChildren(item),
        ], []);
    }
}
