import { BaseType } from "../Type/BaseType.js";
import { ConstructorType } from "../Type/ConstructorType.js";
import { FunctionTypeFormatter } from "./FunctionTypeFormatter.js";

export class ConstructorTypeFormatter extends FunctionTypeFormatter {
    public supportsType(type: BaseType): boolean {
        return type instanceof ConstructorType;
    }
}
