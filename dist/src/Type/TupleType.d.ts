import { BaseType } from "./BaseType";
export declare class TupleType extends BaseType {
    private types;
    constructor(types: Readonly<Array<BaseType>>);
    getId(): string;
    getTypes(): Readonly<Array<BaseType>>;
}
