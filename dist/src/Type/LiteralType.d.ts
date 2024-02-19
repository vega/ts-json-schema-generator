import { BaseType } from "./BaseType";
export type LiteralValue = string | number | boolean;
export declare class LiteralType extends BaseType {
    private value;
    constructor(value: LiteralValue);
    getId(): string;
    getValue(): LiteralValue;
}
