import type { Definition } from "../Schema/Definition.js";
import type { SubTypeFormatter } from "../SubTypeFormatter.js";
import { BaseType } from "../Type/BaseType.js";
import { ObjectProperty, ObjectType } from "../Type/ObjectType.js";
import type { GetDefinitionOptions } from "../TypeFormatter.js";
import type { TypeFormatter } from "../TypeFormatter.js";
export declare class ObjectTypeFormatter implements SubTypeFormatter {
    protected childTypeFormatter: TypeFormatter;
    constructor(childTypeFormatter: TypeFormatter);
    supportsType(type: BaseType): boolean;
    getDefinition(type: ObjectType, options?: GetDefinitionOptions): Definition;
    getChildren(type: ObjectType): BaseType[];
    protected getObjectDefinition(type: ObjectType, options?: GetDefinitionOptions): Definition;
    protected prepareObjectProperty(property: ObjectProperty): ObjectProperty;
}
