import { BaseType } from "./BaseType";

export class DefinitionType extends BaseType {
    public constructor(
        private name: string | undefined,
        private type: BaseType
    ) {
        super();
    }

    public getId(): string {
        return this.type.getId();
    }

    public getName(): string {
        return this.name || super.getName();
    }

    public getType(): BaseType {
        return this.type;
    }

    public getSrcFileName(): string | null {
        return this.type.getSrcFileName();
    }
}
