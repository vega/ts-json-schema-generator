import { BaseType } from "./BaseType";

export class TupleType extends BaseType {
    public constructor(private types: readonly (BaseType | undefined)[]) {
        super();
    }

    public getId(): string {
        return `[${this.types.map((item) => item?.getId() ?? "never").join(",")}]`;
    }

    public getTypes(): readonly (BaseType | undefined)[] {
        return this.types;
    }
}
