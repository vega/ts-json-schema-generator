import { BaseType } from "./BaseType";

export class FunctionType extends BaseType {
    public getId(): string {
        return "function";
    }
}
