import type { BaseType } from "../Type/BaseType.js";
import type { TypeFormatter } from "./TypeFormatter.js";

export interface SubTypeFormatter extends TypeFormatter {
    supportsType(type: BaseType): boolean;
}
