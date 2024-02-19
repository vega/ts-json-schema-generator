import { BaseType } from "../Type/BaseType";
import { LiteralType } from "../Type/LiteralType";
import { StringType } from "../Type/StringType";
export declare function getTypeKeys(type: BaseType): LiteralType[];
export declare function getTypeByKey(type: BaseType, index: LiteralType | StringType): BaseType | undefined;
