import { BaseType } from "./BaseType";
export declare class ObjectProperty {
    private name;
    private type;
    private required;
    constructor(name: string, type: BaseType, required: boolean);
    getName(): string;
    getType(): BaseType;
    isRequired(): boolean;
}
export declare class ObjectType extends BaseType {
    private id;
    private baseTypes;
    private properties;
    private additionalProperties;
    constructor(id: string, baseTypes: BaseType[], properties: ObjectProperty[], additionalProperties: BaseType | false);
    getId(): string;
    getBaseTypes(): BaseType[];
    getProperties(): ObjectProperty[];
    getAdditionalProperties(): BaseType | false;
}
