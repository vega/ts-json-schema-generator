import { BaseType } from "./BaseType";
import { strip } from "../Utils/String";

export class ObjectProperty {
    public constructor(
        private name: string,
        private type: BaseType,
        private required: boolean
    ) {}

    public getName(): string {
        return strip(this.name);
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
        private baseTypes: readonly BaseType[],
        private properties: readonly ObjectProperty[],
        private additionalProperties: BaseType | boolean,
        // whether the object is `object`
        private nonPrimitive: boolean = false,
        srcFileName?: string,
    ) {
        super(srcFileName);
    }

    public getId(): string {
        return this.id;
    }

    public getBaseTypes(): readonly BaseType[] {
        return this.baseTypes;
    }
    public getProperties(): readonly ObjectProperty[] {
        return this.properties;
    }
    public getAdditionalProperties(): BaseType | boolean {
        return this.additionalProperties;
    }
    public getNonPrimitive(): boolean {
        return this.nonPrimitive;
    }
}
