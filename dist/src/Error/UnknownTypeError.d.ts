import { BaseType } from "../Type/BaseType";
import { BaseError } from "./BaseError";
export declare class UnknownTypeError extends BaseError {
    private type;
    constructor(type: BaseType);
    getType(): BaseType;
}
