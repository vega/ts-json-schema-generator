import { BaseType } from "./BaseType";
export declare class UnionType extends BaseType {
    private types;
    constructor(types: BaseType[]);
    getId(): string;
    getTypes(): BaseType[];
}
