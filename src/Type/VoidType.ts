import { BaseType } from "./BaseType";

export class VoidType extends BaseType {
    public getId(): string {
        return "void";
    }
}
