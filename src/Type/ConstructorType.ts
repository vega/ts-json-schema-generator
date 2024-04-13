import { ConstructorDeclaration } from "typescript";
import { BaseType } from "./BaseType";

export class ConstructorType extends BaseType {
    private comment: string;

    constructor(node?: ConstructorDeclaration) {
        super();

        if (node) {
            this.comment = `new (${node.parameters
                .map((p) => p.getFullText())
                .join(",")}) =>${node.type?.getFullText()}`;
        }
    }

    public getId(): string {
        return "constructor";
    }

    public getComment(): string | undefined {
        return this.comment;
    }
}
