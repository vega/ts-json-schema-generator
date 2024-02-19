import { Definition } from "./Schema/Definition";
import { SubTypeFormatter } from "./SubTypeFormatter";
import { BaseType } from "./Type/BaseType";
export declare class CircularReferenceTypeFormatter implements SubTypeFormatter {
    protected childTypeFormatter: SubTypeFormatter;
    protected definition: Map<BaseType, Definition>;
    protected children: Map<BaseType, BaseType[]>;
    constructor(childTypeFormatter: SubTypeFormatter);
    supportsType(type: BaseType): boolean;
    getDefinition(type: BaseType): Definition;
    getChildren(type: BaseType): BaseType[];
}
