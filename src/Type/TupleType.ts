import { BaseType } from "./BaseType";

export class TupleType extends BaseType {
    public constructor(
        private types: BaseType[],
    ) {
        super();
    }

    public getId(): string {
        return "[" + this.types.map((item) => item.getId()).join(",") + "]";
    }

    public getTypes(): BaseType[] {
        return this.types;
    }
}
