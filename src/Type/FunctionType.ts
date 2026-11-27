import type ts from "typescript";
import { BaseType } from "./BaseType.js";
import type { ObjectType } from "./ObjectType.js";

export class FunctionType extends BaseType {
    private comment: string | undefined;
    protected returnType: BaseType | undefined;
    private resolveReturnType: (() => BaseType | undefined) | undefined;

    /**
     * @param returnType The return type, or a function that creates it. The schema never contains the
     * return type. It is only needed to match `ReturnType<T>` or `infer` against this function. Pass a
     * function so the return type is created only when it is needed. Creating it right away never ends
     * when it refers to a new instance of the generic type that holds this function
     * (for example, `wrap: () => Box<T[]>` inside `Box<T>`).
     */
    constructor(
        node?: ts.FunctionTypeNode | ts.FunctionExpression | ts.FunctionDeclaration | ts.ArrowFunction,
        protected namedArguments?: ObjectType,
        returnType?: BaseType | (() => BaseType | undefined),
    ) {
        super();

        if (typeof returnType === "function") {
            this.resolveReturnType = returnType;
        } else {
            this.returnType = returnType;
        }

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

    public getReturnType(): BaseType | undefined {
        if (this.resolveReturnType) {
            const resolve = this.resolveReturnType;
            this.resolveReturnType = undefined;
            this.returnType = resolve();
        }
        return this.returnType;
    }
}
