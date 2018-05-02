import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { AnnotatedType } from "../Type/AnnotatedType";
import { BaseType } from "../Type/BaseType";
import { TypeFormatter } from "../TypeFormatter";
export declare function makeNullable(def: Definition): Definition;
export declare class AnnotatedTypeFormatter implements SubTypeFormatter {
    private childTypeFormatter;
    constructor(childTypeFormatter: TypeFormatter);
    supportsType(type: AnnotatedType): boolean;
    getDefinition(type: AnnotatedType): Definition;
    getChildren(type: AnnotatedType): BaseType[];
}
