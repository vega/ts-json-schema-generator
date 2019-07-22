import { ArrayType } from "./ArrayType";
import { BaseType } from "./BaseType";

export class RestType extends BaseType {
    public constructor(private item: ArrayType) {
        super();
    }

    public getId(): string {
        return "..." + this.item.getId();
    }

    public getType(): ArrayType {
        return this.item;
    }
}
