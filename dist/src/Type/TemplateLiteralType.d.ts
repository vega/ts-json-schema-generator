import { BaseType } from "./BaseType.js";
export declare class TemplateLiteralType extends BaseType {
    private types;
    constructor(types: readonly BaseType[]);
    getId(): string;
    getParts(): readonly BaseType[];
}
