import * as ts from "typescript";
import { BaseError } from "./BaseError";

export class UnknownNodeError extends BaseError {
    public constructor(private node: ts.Node, private reference?: ts.Node) {
        super(
            `Unknown node of kind ${ts.SyntaxKind[node.kind.valueOf()]} in file ${
                node.getSourceFile().fileName
            }: "${node.getFullText()}`
        );
    }

    public getNode(): ts.Node {
        return this.node;
    }

    public getReference(): ts.Node | undefined {
        return this.reference;
    }
}
