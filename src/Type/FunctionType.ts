import ts from "typescript";
import { BaseType } from "./BaseType.js";
import { ObjectType } from "./ObjectType.js";

export class FunctionType extends BaseType {
    private comment: string;

    constructor(
        node?: ts.FunctionTypeNode | ts.FunctionExpression | ts.FunctionDeclaration | ts.ArrowFunction,
        protected namedArguments?: ObjectType
    ) {
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

    public getNamedArguments(): ObjectType | undefined {
        return this.namedArguments;
    }
}
