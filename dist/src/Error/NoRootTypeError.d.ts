import { BaseError } from "./BaseError";
export declare class NoRootTypeError extends BaseError {
    private type;
    constructor(type: string);
    readonly name: string;
    readonly message: string;
    getType(): string;
}
