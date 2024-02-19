import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { BaseType } from "../Type/BaseType";
import { ReferenceType } from "../Type/ReferenceType";
import { TypeFormatter } from "../TypeFormatter";
export declare class ReferenceTypeFormatter implements SubTypeFormatter {
    protected childTypeFormatter: TypeFormatter;
    protected encodeRefs: boolean;
    constructor(childTypeFormatter: TypeFormatter, encodeRefs: boolean);
    supportsType(type: ReferenceType): boolean;
    getDefinition(type: ReferenceType): Definition;
    getChildren(type: ReferenceType): BaseType[];
}
