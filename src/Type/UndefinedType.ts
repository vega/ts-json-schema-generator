import { BaseType } from "./BaseType";

export class UndefinedType extends BaseType {
    public getId(): string {
        return "undefined";
    }
}
