import { BaseType } from "./BaseType.js";

export class UnknownType extends BaseType {
    constructor() {
        super();
    }
    public getId(): string {
        return "unknown";
    }
}
