import { BaseType } from "./BaseType.js";
export declare class AliasType extends BaseType {
    private id;
    private type;
    constructor(id: string, type: BaseType);
    getId(): string;
    getType(): BaseType;
}
