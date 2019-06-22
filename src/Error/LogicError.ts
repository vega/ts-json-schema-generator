import { BaseError } from "./BaseError";

export class LogicError extends BaseError {
    public constructor(private msg: string) {
        super(msg);
    }
}
