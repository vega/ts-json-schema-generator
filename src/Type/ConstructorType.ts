import ts from "typescript";
import { BaseType } from "./BaseType";
import { ObjectType } from "./ObjectType";

export class ConstructorType extends BaseType {
    private comment: string;

    constructor(
        node?: ts.ConstructorTypeNode,
        protected namedArguments?: ObjectType
    ) {
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

    public getNamedArguments(): ObjectType | undefined {
        return this.namedArguments;
    }
}
