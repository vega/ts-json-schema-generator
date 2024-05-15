import { BaseType } from "./BaseType.js";

export class NeverType extends BaseType {
    public getId(): string {
        return "never";
    }
}
