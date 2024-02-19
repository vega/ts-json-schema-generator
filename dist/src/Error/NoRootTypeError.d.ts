import { BaseError } from "./BaseError";
export declare class NoRootTypeError extends BaseError {
    private type;
    constructor(type: string);
    getType(): string;
}
