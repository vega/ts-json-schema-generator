import { BaseType } from "./BaseType";

export class AliasType extends BaseType {
    public constructor(
        private id: string,
        private type: BaseType,
        srcFileName?: string
    ) {
        super(srcFileName);
    }

    public getId(): string {
        return this.id;
    }

    public getType(): BaseType {
        return this.type;
    }
}
