import { BaseType } from "./BaseType.js";

export class AnyType extends BaseType {
    public getId(): string {
        return "any";
    }
}
