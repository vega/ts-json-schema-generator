import * as ts from "typescript";
import { BaseError } from "./BaseError";
export declare class UnknownNodeError extends BaseError {
    private node;
    private reference;
    constructor(node: ts.Node, reference?: ts.Node);
    readonly name: string;
    readonly message: string;
    getNode(): ts.Node;
    getReference(): ts.Node | undefined;
}
