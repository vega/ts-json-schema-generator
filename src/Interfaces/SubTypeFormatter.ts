import { BaseType } from "../Type/BaseType.js";
import { TypeFormatter } from "./TypeFormatter.js";

export interface SubTypeFormatter extends TypeFormatter {
    supportsType(type: BaseType): boolean;
}
