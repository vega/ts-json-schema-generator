import { BaseType } from "./BaseType.js";

export class ArrayType extends BaseType {
    public constructor(private item: BaseType) {
        super();
    }

    public getId(): string {
        return `${this.item.getId()}[]`;
    }

    public getItem(): BaseType {
        return this.item;
    }
}
