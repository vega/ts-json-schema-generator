import { BaseError } from "./BaseError";
export declare class LogicError extends BaseError {
    private msg;
    constructor(msg: string);
    readonly name: string;
    readonly message: string;
}
