import { BaseType } from "./BaseType";
export declare class AliasType extends BaseType {
    private id;
    private type;
    constructor(id: string, type: BaseType);
    getId(): string;
    getType(): BaseType;
}
