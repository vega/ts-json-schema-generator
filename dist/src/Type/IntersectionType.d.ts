import { BaseType } from "./BaseType";
export declare class IntersectionType extends BaseType {
    private types;
    constructor(types: BaseType[]);
    getId(): string;
    getTypes(): BaseType[];
}
