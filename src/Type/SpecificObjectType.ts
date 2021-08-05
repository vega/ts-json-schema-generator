import { JSONSchema7TypeName } from "json-schema";
import { BaseType } from "./BaseType";

export class SpecificObjectType extends BaseType {
    public constructor(private id: string, private definitionType: JSONSchema7TypeName, private multiple: boolean) {
        super();
    }

    public getId(): string {
        return this.id;
    }

    public getDefinitionType(): JSONSchema7TypeName {
        return this.definitionType;
    }

    public isMultiple(): boolean {
        return this.multiple;
    }
}
