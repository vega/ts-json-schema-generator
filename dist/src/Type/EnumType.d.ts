import { BaseType } from "./BaseType";
export type EnumValue = string | boolean | number | null;
export declare class EnumType extends BaseType {
    private id;
    private values;
    private types;
    constructor(id: string, values: readonly EnumValue[]);
    getId(): string;
    getValues(): readonly EnumValue[];
    getTypes(): BaseType[];
}
