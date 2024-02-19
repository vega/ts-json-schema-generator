import { BaseType } from "./BaseType";
export declare class OptionalType extends BaseType {
    private item;
    constructor(item: BaseType);
    getId(): string;
    getType(): BaseType;
}
