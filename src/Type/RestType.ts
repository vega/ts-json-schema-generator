import { ArrayType } from "./ArrayType";
import { BaseType } from "./BaseType";

export class RestType extends BaseType {
    public constructor(private item: ArrayType, private title: string | null = null) {
        super();
    }

    public getId(): string {
        return `...${this.item.getId()}${this.title || ""}`;
    }

    public getTitle(): string | null {
        return this.title;
    }

    public getType(): ArrayType {
        return this.item;
    }
}
