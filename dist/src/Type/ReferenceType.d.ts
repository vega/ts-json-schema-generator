import { BaseType } from "./BaseType.js";
export declare class ReferenceType extends BaseType {
    private type;
    private id;
    private name;
    getId(): string;
    setId(id: string): void;
    getName(): string;
    setName(name: string): void;
    getType(): BaseType;
    hasType(): boolean;
    setType(type: BaseType): void;
}
