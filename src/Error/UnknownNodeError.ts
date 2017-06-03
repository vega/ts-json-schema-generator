import * as ts from "typescript";
import { BaseError } from "./BaseError";

export class UnknownNodeError extends BaseError {
    public constructor(private node: ts.Node, private reference?: ts.Node) {
        super();
    }

    public get name(): string {
        return "UnknownNodeError";
    }
    public get message(): string {
        return `Unknown node "${this.node.getFullText()}`;
    }

    public getNode(): ts.Node {
        return this.node;
    }
    public getReference(): ts.Node | undefined {
        return this.reference;
    }
}
