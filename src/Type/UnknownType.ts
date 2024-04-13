import { BaseType } from "./BaseType";

export class UnknownType extends BaseType {
    constructor() {
        super();
    }
    public getId(): string {
        return "unknown";
    }
}
