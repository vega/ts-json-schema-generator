import { TypeFormatter } from "../TypeFormatter";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { IntersectionType } from "../Type/IntersectionType";
import { BaseType } from "../Type/BaseType";
import { Definition } from "../Schema/Definition";
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
        return type.getTypes().reduce(
            getAllOfDefinitionReducer(this.childTypeFormatter),
            {type: "object", additionalProperties: false} as Definition);
    }
    public getChildren(type: IntersectionType): BaseType[] {
        return type.getTypes().reduce((result: BaseType[], item: BaseType) => [
            ...result,
            ...this.childTypeFormatter.getChildren(item),
        ], []);
    }
}
