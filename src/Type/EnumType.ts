import { BaseType } from "./BaseType.js";
import { LiteralType } from "./LiteralType.js";
import { NullType } from "./NullType.js";

export type EnumValue = string | boolean | number | null;

export class EnumType extends BaseType {
    private types: BaseType[];

    public constructor(
        private id: string,
        private values: readonly EnumValue[],
    ) {
        super();
        this.types = values.map((value) => (value == null ? new NullType() : new LiteralType(value)));
    }

    public getId(): string {
        return this.id;
    }

    public getValues(): readonly EnumValue[] {
        return this.values;
    }

    public getTypes(): BaseType[] {
        return this.types;
    }
}
