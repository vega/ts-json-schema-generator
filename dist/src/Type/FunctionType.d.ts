import type ts from "typescript";
import { BaseType } from "./BaseType.js";
import type { ObjectType } from "./ObjectType.js";
export declare class FunctionType extends BaseType {
    protected namedArguments?: ObjectType | undefined;
    private comment;
    constructor(node?: ts.FunctionTypeNode | ts.FunctionExpression | ts.FunctionDeclaration | ts.ArrowFunction, namedArguments?: ObjectType | undefined);
    getId(): string;
    getComment(): string | undefined;
    getNamedArguments(): ObjectType | undefined;
}
