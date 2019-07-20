import { BaseType } from "./BaseType";
import { strip } from '../Utils/String';

export class ObjectProperty {
    public constructor(
        private name: string,
        private type: BaseType,
        private required: boolean,
    ) {
    }

    public getName(stripQuotes: boolean = false): string {
        if (stripQuotes) {
            return strip(this.name);
        }
        return this.name;
    }
    public getType(): BaseType {
        return this.type;
    }
    public isRequired(): boolean {
        return this.required;
    }
}

export class ObjectType extends BaseType {
    public constructor(
        private id: string,
        private baseTypes: BaseType[],
        private properties: ObjectProperty[],
        private additionalProperties: BaseType|boolean,
    ) {
        super();
    }

    public getId(): string {
        return this.id;
    }

    public getBaseTypes(): BaseType[] {
        return this.baseTypes;
    }
    public getProperties(): ObjectProperty[] {
        return this.properties;
    }
    public getAdditionalProperties(): BaseType|boolean {
        return this.additionalProperties;
    }
}
