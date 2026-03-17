import { BaseType } from "../Type/BaseType.js";
import { LiteralType } from "../Type/LiteralType.js";
import { NumberType } from "../Type/NumberType.js";
import type { StringType } from "../Type/StringType.js";
export declare function getTypeKeys(type: BaseType): LiteralType[];
export declare function getTypeByKey(type: BaseType, index: LiteralType | StringType | NumberType): BaseType | undefined;
