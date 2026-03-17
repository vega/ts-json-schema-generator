import { BaseType } from "./BaseType.js";
export declare class TupleType extends BaseType {
    private types;
    constructor(types: Readonly<Array<BaseType>>);
    getId(): string;
    getTypes(): Readonly<Array<BaseType>>;
}
