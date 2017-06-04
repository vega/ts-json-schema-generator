import { Definition } from "../Schema/Definition";
import { BaseType } from "../Type/BaseType";
import { TypeFormatter } from "../TypeFormatter";
export declare function getAllOfDefinitionReducer(childTypeFormatter: TypeFormatter): (definition: Definition, baseType: BaseType) => Definition;
