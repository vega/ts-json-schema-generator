import { BaseType } from "./BaseType.js";
export declare class ArrayType extends BaseType {
    private item;
    constructor(item: BaseType);
    getId(): string;
    getItem(): BaseType;
}
