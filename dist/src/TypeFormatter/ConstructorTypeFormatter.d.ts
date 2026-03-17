import type { BaseType } from "../Type/BaseType.js";
import { FunctionTypeFormatter } from "./FunctionTypeFormatter.js";
export declare class ConstructorTypeFormatter extends FunctionTypeFormatter {
    supportsType(type: BaseType): boolean;
}
