import { BaseType } from "./BaseType.js";
export declare class IntersectionType extends BaseType {
    private types;
    constructor(types: BaseType[]);
    getId(): string;
    getTypes(): BaseType[];
}
