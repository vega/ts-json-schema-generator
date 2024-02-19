import { BaseError } from "./BaseError";
export declare class NoTSConfigError extends BaseError {
    get name(): string;
    get message(): string;
}
