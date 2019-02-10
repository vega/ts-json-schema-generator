import { PrimitiveType } from "./PrimitiveType";

export type LiteralValue = string|number|boolean;

export class LiteralType extends PrimitiveType {
    public constructor(
        private value: LiteralValue,
    ) {
        super();
    }

    public getId(): string {
        return JSON.stringify(this.value);
    }

    public getValue(): LiteralValue {
        return this.value;
    }
}
