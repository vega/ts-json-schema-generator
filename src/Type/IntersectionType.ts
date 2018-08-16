import { BaseType } from "./BaseType";

export class IntersectionType extends BaseType {
    public constructor(
        private types: BaseType[],
    ) {
        super();
    }

    public getId(): string {
        return "(" + this.types.map((type: BaseType) => type.getId()).join("&") + ")";
    }

    public getTypes(): BaseType[] {
        return this.types;
    }
}
