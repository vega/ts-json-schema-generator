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
    private nonPrimitive;
    constructor(id: string, baseTypes: readonly BaseType[], properties: readonly ObjectProperty[], additionalProperties: BaseType | boolean, nonPrimitive?: boolean);
    getId(): string;
    getBaseTypes(): readonly BaseType[];
    getProperties(): readonly ObjectProperty[];
    getAdditionalProperties(): BaseType | boolean;
    getNonPrimitive(): boolean;
}
