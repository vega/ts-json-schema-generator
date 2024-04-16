import { ArrayType } from "./ArrayType.js";
import { BaseType } from "./BaseType.js";
import { InferType } from "./InferType.js";
import { TupleType } from "./TupleType.js";

export class RestType extends BaseType {
    public constructor(
        private item: ArrayType | InferType | TupleType,
        private title: string | null = null,
    ) {
        super();
    }

    public getId(): string {
        return `...${this.item.getId()}${this.title || ""}`;
    }

    public getTitle(): string | null {
        return this.title;
    }

    public getType(): ArrayType | InferType | TupleType {
        return this.item;
    }
}
