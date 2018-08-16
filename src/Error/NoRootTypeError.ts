import { BaseError } from "./BaseError";

export class NoRootTypeError extends BaseError {
    public constructor(private type: string) {
        super();
    }

    public get name(): string {
        return "NoRootTypeError";
    }
    public get message(): string {
        return `No root type "${this.type}" found`;
    }

    public getType(): string {
        return this.type;
    }
}
