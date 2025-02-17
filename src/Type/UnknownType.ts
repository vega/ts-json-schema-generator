import { BaseType } from "./BaseType.js";

export class UnknownType extends BaseType {
    constructor(
        /**
         * If the source for this UnknownType was from a failed operation than to an actual `unknown` type present in the source code.
         */
        readonly erroredSource: boolean,
    ) {
        super();
    }

    public getId(): string {
        return "unknown";
    }
}

/**
 * Checks for an UnknownType with an errored source.
 */
export function isErroredUnknownType(type: BaseType): type is UnknownType {
    return type instanceof UnknownType && type.erroredSource;
}
