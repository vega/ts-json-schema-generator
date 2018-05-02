import { BaseType } from "./BaseType";
export declare class DefinitionType extends BaseType {
    private name;
    private type;
    constructor(name: string, type: BaseType);
    getId(): string;
    getType(): BaseType;
}
