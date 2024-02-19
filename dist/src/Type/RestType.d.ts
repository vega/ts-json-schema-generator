import { ArrayType } from "./ArrayType";
import { BaseType } from "./BaseType";
import { InferType } from "./InferType";
import { TupleType } from "./TupleType";
export declare class RestType extends BaseType {
    private item;
    private title;
    constructor(item: ArrayType | InferType | TupleType, title?: string | null);
    getId(): string;
    getTitle(): string | null;
    getType(): ArrayType | InferType | TupleType;
}
