import { TypeFormatter } from "../TypeFormatter";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { IntersectionType } from "../Type/IntersectionType";
import { BaseType } from "../Type/BaseType";
import { Definition } from "../Schema/Definition";

export class IntersectionTypeFormatter implements SubTypeFormatter {
    public constructor(
        private childTypeFormatter: TypeFormatter,
    ) {
    }

    public supportsType(type: IntersectionType): boolean {
        return type instanceof IntersectionType;
    }
    public getDefinition(type: IntersectionType): Definition {
        return {
            allOf: type.getTypes().map((item: BaseType) => this.childTypeFormatter.getDefinition(item)),
        };
    }
    public getChildren(type: IntersectionType): BaseType[] {
        return type.getTypes().reduce((result: BaseType[], item: BaseType) => [
            ...result,
            ...this.childTypeFormatter.getChildren(item),
        ], []);
    }
}
