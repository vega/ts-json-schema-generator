import { FunctionDeclaration } from "typescript";
import { BaseType } from "./BaseType";

export class FunctionType extends BaseType {
    private comment: string;

    constructor(node?: FunctionDeclaration) {
        super();

        if (node) {
            this.comment = `(${node.parameters.map((p) => p.getFullText()).join(",")}) =>${node.type?.getFullText()}`;
        }
    }

    public getId(): string {
        return "function";
    }

    public getComment(): string | undefined {
        return this.comment;
    }
}
