import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { BaseType } from "../Type/BaseType";
import { ObjectProperty, ObjectType } from "../Type/ObjectType";
import { TypeFormatter } from "../TypeFormatter";
export declare class ObjectTypeFormatter implements SubTypeFormatter {
    protected childTypeFormatter: TypeFormatter;
    constructor(childTypeFormatter: TypeFormatter);
    supportsType(type: ObjectType): boolean;
    getDefinition(type: ObjectType): Definition;
    getChildren(type: ObjectType): BaseType[];
    protected getObjectDefinition(type: ObjectType): Definition;
    protected prepareObjectProperty(property: ObjectProperty): ObjectProperty;
}
