import { BaseError } from "./BaseError.js";

export class LogicError extends BaseError {
    public constructor(private msg: string) {
        super(msg);
    }
}
