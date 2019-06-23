import { BaseType } from "./BaseType";

export class UnknownType extends BaseType {
    public getId(): string {
        return "unknown";
    }
}
