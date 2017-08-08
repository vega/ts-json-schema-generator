import { BaseType } from "./BaseType";
export declare class TupleType extends BaseType {
    private types;
    constructor(types: BaseType[]);
    getId(): string;
    getTypes(): BaseType[];
}
