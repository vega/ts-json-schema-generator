import { BaseType } from "./BaseType.js";

export class UndefinedType extends BaseType {
    public getId(): string {
        return "undefined";
    }
}
