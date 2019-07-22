import { BaseType } from "./BaseType";

export class AliasType extends BaseType {
    public constructor(private id: string, private type: BaseType) {
        super();
    }

    public getId(): string {
        return this.id;
    }

    public getType(): BaseType {
        return this.type;
    }
}
