export abstract class BaseError implements Error {
    private callStack: any;

    public constructor() {
        this.callStack = new Error().stack;
    }

    public get stack(): string {
        return this.callStack;
    }

    public abstract get name(): string;
    public abstract get message(): string;
}
