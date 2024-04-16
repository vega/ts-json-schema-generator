import { BaseType } from "../Type/BaseType";
import { ConstructorType } from "../Type/ConstructorType";
import { FunctionTypeFormatter } from "./FunctionTypeFormatter";

export class ConstructorTypeFormatter extends FunctionTypeFormatter {
    public supportsType(type: BaseType): boolean {
        return type instanceof ConstructorType;
    }
}
