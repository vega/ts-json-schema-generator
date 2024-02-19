import { BaseType } from "./BaseType";
export declare class ArrayType extends BaseType {
    private item;
    constructor(item: BaseType);
    getId(): string;
    getItem(): BaseType;
}
