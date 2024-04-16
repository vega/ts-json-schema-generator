import { BaseType } from "./BaseType.js";

export class VoidType extends BaseType {
    public getId(): string {
        return "void";
    }
}
