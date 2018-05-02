import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { BaseType } from "../Type/BaseType";
import { UnionType } from "../Type/UnionType";
import { TypeFormatter } from "../TypeFormatter";
export declare class UnionTypeFormatter implements SubTypeFormatter {
    private childTypeFormatter;
    constructor(childTypeFormatter: TypeFormatter);
    supportsType(type: UnionType): boolean;
    getDefinition(type: UnionType): Definition;
    getChildren(type: UnionType): BaseType[];
}
