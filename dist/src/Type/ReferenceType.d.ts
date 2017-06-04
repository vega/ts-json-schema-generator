import { BaseType } from "./BaseType";
export declare class ReferenceType extends BaseType {
    private type;
    getId(): string;
    getType(): BaseType;
    setType(type: BaseType): void;
}
