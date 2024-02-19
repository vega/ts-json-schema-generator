import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { BaseType } from "../Type/BaseType";
import { IntersectionType } from "../Type/IntersectionType";
import { TypeFormatter } from "../TypeFormatter";
export declare class IntersectionTypeFormatter implements SubTypeFormatter {
    protected childTypeFormatter: TypeFormatter;
    constructor(childTypeFormatter: TypeFormatter);
    supportsType(type: IntersectionType): boolean;
    getDefinition(type: IntersectionType): Definition;
    getChildren(type: IntersectionType): BaseType[];
}
