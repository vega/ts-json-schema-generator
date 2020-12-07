import { BaseType } from "./BaseType";

export class OptionalType extends BaseType {
    public constructor(private item: BaseType) {
        super();
    }

    public getId(): string {
        return `${this.item.getId()}?`;
    }

    public getType(): BaseType {
        return this.item;
    }
}
