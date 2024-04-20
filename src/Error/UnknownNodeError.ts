import ts from "typescript";
import { BaseError } from "./BaseError.js";

export class UnknownNodeError extends BaseError {
    public constructor(
        private node: ts.Node,
        private reference?: ts.Node,
    ) {
        super(
            `Unknown node "${node.getSourceFile() ? node.getFullText() : "<unknown>"}" of kind "${
                ts.SyntaxKind[node.kind]
            }"`,
        );
    }

    public getNode(): ts.Node {
        return this.node;
    }

    public getReference(): ts.Node | undefined {
        return this.reference;
    }
}
