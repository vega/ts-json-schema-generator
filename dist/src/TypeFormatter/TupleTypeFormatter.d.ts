import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { BaseType } from "../Type/BaseType";
import { TupleType } from "../Type/TupleType";
import { TypeFormatter } from "../TypeFormatter";
export declare class TupleTypeFormatter implements SubTypeFormatter {
    private childTypeFormatter;
    constructor(childTypeFormatter: TypeFormatter);
    supportsType(type: TupleType): boolean;
    getDefinition(type: TupleType): Definition;
    getChildren(type: TupleType): BaseType[];
}
