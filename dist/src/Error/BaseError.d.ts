export declare abstract class BaseError implements Error {
    private callStack;
    constructor();
    readonly stack: string;
    readonly abstract name: string;
    readonly abstract message: string;
}
