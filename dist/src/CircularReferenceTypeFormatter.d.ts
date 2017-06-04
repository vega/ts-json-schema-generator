import { Definition } from "./Schema/Definition";
import { SubTypeFormatter } from "./SubTypeFormatter";
import { BaseType } from "./Type/BaseType";
export declare class CircularReferenceTypeFormatter implements SubTypeFormatter {
    private childTypeFormatter;
    private definition;
    private children;
    constructor(childTypeFormatter: SubTypeFormatter);
    supportsType(type: BaseType): boolean;
    getDefinition(type: BaseType): Definition;
    getChildren(type: BaseType): BaseType[];
}
