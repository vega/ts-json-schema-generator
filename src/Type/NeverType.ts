import { BaseType } from "./BaseType";

export class NeverType extends BaseType {
    public getId(): string {
        return "never";
    }
}
