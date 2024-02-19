import { BaseError } from "./BaseError";
export declare class NoRootNamesError extends BaseError {
    get name(): string;
    get message(): string;
}
