import { BaseType } from "./BaseType";

export class ReferenceType extends BaseType {
    private type: BaseType;

    public getId(): string {
        return this.type.getId();
    }

    public getType(): BaseType {
        return this.type;
    }
    public setType(type: BaseType): void {
        this.type = type;
    }
}
