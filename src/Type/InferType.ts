import { BaseType } from "./BaseType.js";

export class InferType extends BaseType {
    constructor(private id: string) {
        super();
    }

    public getId(): string {
        return this.id;
    }
}
