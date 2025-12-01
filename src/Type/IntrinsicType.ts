import type { BaseType } from "./BaseType.js";
import { PrimitiveType } from "./PrimitiveType.js";

export class IntrinsicType extends PrimitiveType {
    constructor(
        protected method: (v: string) => string,
        protected argument: BaseType,
    ) {
        super();
    }

    public getId(): string {
        return `${this.getMethod().name}<${this.getArgument().getId()}>`;
    }

    public getMethod(): (v: string) => string {
        return this.method;
    }

    public getArgument(): BaseType {
        return this.argument;
    }
}
