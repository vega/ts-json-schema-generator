import { BaseType } from "./BaseType";

export class UnionType extends BaseType {
    public constructor(
        private types: BaseType[],
    ) {
        super();
    }

    public getId(): string {
        return "(" + this.types.map((type) => type.getId()).join("|") + ")";
    }

    public getTypes(): BaseType[] {
        return this.types;
    }
}
