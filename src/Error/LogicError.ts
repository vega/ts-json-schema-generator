import { BaseError } from "./BaseError";

export class LogicError extends BaseError {
    public constructor(private msg: string) {
        super();
    }

    public get name(): string {
        return "LogicError";
    }
    public get message(): string {
        return this.msg;
    }
}
