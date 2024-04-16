import { BaseError } from "./BaseError.js";

export class NoTSConfigError extends BaseError {
    public get name(): string {
        return "NoTSConfigError";
    }
    public get message(): string {
        return `No tsconfig file found`;
    }
}
