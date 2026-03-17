import { PrimitiveType } from "./PrimitiveType.js";
export declare class StringType extends PrimitiveType {
    protected preserveLiterals: boolean;
    constructor(preserveLiterals?: boolean);
    getId(): string;
    getPreserveLiterals(): boolean;
}
