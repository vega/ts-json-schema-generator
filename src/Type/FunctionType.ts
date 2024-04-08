import { BaseType } from "./BaseType";

export class FunctionType extends BaseType {
    constructor(private comment?: string) {
        super();
    }

    public getId(): string {
        return "function";
    }

    public getComment(): string | undefined {
        return this.comment;
    }
}
