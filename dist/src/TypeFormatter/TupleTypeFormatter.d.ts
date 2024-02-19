import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { BaseType } from "../Type/BaseType";
import { TupleType } from "../Type/TupleType";
import { TypeFormatter } from "../TypeFormatter";
export declare class TupleTypeFormatter implements SubTypeFormatter {
    protected childTypeFormatter: TypeFormatter;
    constructor(childTypeFormatter: TypeFormatter);
    supportsType(type: BaseType): boolean;
    getDefinition(type: TupleType): Definition;
    getChildren(type: TupleType): BaseType[];
}
