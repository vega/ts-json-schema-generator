import { BaseType } from "./BaseType.js";
export declare class OptionalType extends BaseType {
    private item;
    constructor(item: BaseType);
    getId(): string;
    getType(): BaseType;
}
