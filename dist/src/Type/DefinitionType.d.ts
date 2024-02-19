import { BaseType } from "./BaseType";
export declare class DefinitionType extends BaseType {
    private name;
    private type;
    constructor(name: string | undefined, type: BaseType);
    getId(): string;
    getName(): string;
    getType(): BaseType;
}
