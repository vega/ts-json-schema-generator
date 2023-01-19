import { BaseType } from "./BaseType";

export class UnknownType extends BaseType {
    constructor(private comment?: string) {
        super();
    }
    public getId(): string {
        return "unknown";
    }

    public getComment(): string | undefined {
        return this.comment;
    }
}
