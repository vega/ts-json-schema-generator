import { BaseType } from "../Type/BaseType";
import { TypeFormatter } from "./TypeFormatter";
export interface SubTypeFormatter extends TypeFormatter {
    supportsType(type: BaseType): boolean;
}
