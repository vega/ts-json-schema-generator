import { BaseType } from "./BaseType";

export class DefinitionType extends BaseType {
    public constructor(
        private name: string,
        private type: BaseType,
    ) {
        super();
    }

    public getId(): string {
        return "def-" + this.type.getId();
    }

    public getName() {
        return this.name;
    }

    public getType(): BaseType {
        return this.type;
    }
}
