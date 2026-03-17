import { BaseType } from "./BaseType.js";
export type LiteralValue = string | number | boolean;
export declare class LiteralType extends BaseType {
    private value;
    constructor(value: LiteralValue);
    getId(): string;
    getValue(): LiteralValue;
    isString(): boolean;
}
