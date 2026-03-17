import { BaseType } from "./BaseType.js";
export declare class DefinitionType extends BaseType {
    private name;
    private type;
    constructor(name: string | undefined, type: BaseType);
    getId(): string;
    getName(): string;
    getType(): BaseType;
}
