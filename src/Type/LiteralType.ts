import { BaseType } from "./BaseType.js";

export type LiteralValue = string | number | boolean;

export class LiteralType extends BaseType {
    public constructor(private value: LiteralValue) {
        super();
    }

    public getId(): string {
        return JSON.stringify(this.value);
    }

    public getValue(): LiteralValue {
        return this.value;
    }
}
