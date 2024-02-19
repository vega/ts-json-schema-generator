import { BaseError } from "./BaseError";
export declare class LogicError extends BaseError {
    private msg;
    constructor(msg: string);
}
