import type { ArrayType } from "./ArrayType.js";
import { BaseType } from "./BaseType.js";
import type { InferType } from "./InferType.js";
import type { TupleType } from "./TupleType.js";
export declare class RestType extends BaseType {
    private item;
    private title;
    constructor(item: ArrayType | InferType | TupleType, title?: string | null);
    getId(): string;
    getTitle(): string | null;
    getType(): ArrayType | InferType | TupleType;
}
