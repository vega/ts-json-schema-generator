import { BaseType } from "../Type/BaseType";
import { BaseError } from "./BaseError";

export class UnknownTypeError extends BaseError {
    public constructor(private type: BaseType) {
        super();
    }

    public get name(): string {
        return "UnknownTypeError";
    }
    public get message(): string {
        return `Unknown type "${this.type.getId()}"`;
    }

    public getType(): BaseType {
        return this.type;
    }
}
