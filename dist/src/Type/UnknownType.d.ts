import { BaseType } from "./BaseType.js";
export declare class UnknownType extends BaseType {
    /**
     * If the source for this UnknownType was from a failed operation than to an actual `unknown` type present in the source code.
     */
    readonly erroredSource: boolean;
    constructor(
    /**
     * If the source for this UnknownType was from a failed operation than to an actual `unknown` type present in the source code.
     */
    erroredSource?: boolean);
    getId(): string;
}
/**
 * Checks for an UnknownType with an errored source.
 */
export declare function isErroredUnknownType(type: BaseType): type is UnknownType;
