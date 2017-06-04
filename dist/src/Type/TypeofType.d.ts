import { BaseType } from "./BaseType";
import * as ts from "typescript";
export declare class TypeofType extends BaseType {
    private id;
    private expression;
    constructor(id: string, expression: ts.Expression);
    getId(): string;
}
