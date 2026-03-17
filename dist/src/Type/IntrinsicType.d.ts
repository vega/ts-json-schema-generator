import type { BaseType } from "./BaseType.js";
import { PrimitiveType } from "./PrimitiveType.js";
export declare class IntrinsicType extends PrimitiveType {
    protected method: (v: string) => string;
    protected argument: BaseType;
    constructor(method: (v: string) => string, argument: BaseType);
    getId(): string;
    getMethod(): (v: string) => string;
    getArgument(): BaseType;
}
