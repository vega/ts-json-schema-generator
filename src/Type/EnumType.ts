import { BaseType } from "./BaseType";

export type EnumValue = string|boolean|number|null;

export class EnumType extends BaseType {
    public constructor(
        private id: string,
        private values: EnumValue[],
    ) {
        super();
    }

    public getId(): string {
        return this.id;
    }

    public getValues(): EnumValue[] {
        return this.values;
    }
}
