import { BaseType } from "./BaseType";

export class AliasType extends BaseType {
    public constructor(private id: string, private type: BaseType, private srcFileName: string) {
        super();
    }

    public getId(): string {
        return this.id;
    }

    public getType(): BaseType {
        return this.type;
    }

    public getSrcFileName(): string {
        return this.srcFileName;
    }
}
