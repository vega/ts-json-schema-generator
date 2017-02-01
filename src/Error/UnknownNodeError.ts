import * as ts from "typescript";
import { BaseError } from "./BaseError";

export class UnknownNodeError extends BaseError {
    public constructor(private node: ts.Node) {
        super();
    }

    public get name(): string {
        return "UnknownNodeError";
    }
    public get message(): string {
        return `Unknown node: {kind: ${this.node.kind}}`;
    }

    public getNode(): ts.Node {
        return this.node;
    }
}
