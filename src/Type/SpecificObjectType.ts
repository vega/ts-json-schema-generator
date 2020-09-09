import { BaseType } from "./BaseType";

export class SpecificObjectType extends BaseType {
    public constructor(private id: string, private definitionType: string, private multiple: boolean) {
        super();
    }

    public getId(): string {
        return this.id;
    }

    public getDefinitionType(): string {
        return this.definitionType;
    }

    public isMultiple(): boolean {
        return this.multiple;
    }
}
