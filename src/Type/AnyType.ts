import { BaseType } from "./BaseType";

export class AnyType extends BaseType {
    public getId(): string {
        return "any";
    }
}
