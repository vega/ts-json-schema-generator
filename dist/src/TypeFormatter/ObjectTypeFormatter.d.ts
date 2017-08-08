import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { BaseType } from "../Type/BaseType";
import { ObjectType } from "../Type/ObjectType";
import { TypeFormatter } from "../TypeFormatter";
export declare class ObjectTypeFormatter implements SubTypeFormatter {
    private childTypeFormatter;
    constructor(childTypeFormatter: TypeFormatter);
    supportsType(type: ObjectType): boolean;
    getDefinition(type: ObjectType): Definition;
    getChildren(type: ObjectType): BaseType[];
    private getObjectDefinition(type);
}
