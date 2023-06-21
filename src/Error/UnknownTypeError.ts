import { BaseType } from "../Type/BaseType";
import { BaseError } from "./BaseError";

export class UnknownTypeError extends BaseError {
    public constructor(private type: BaseType) {
        super(`Unknown type "${type.getId()}"`);
    }

    public getType(): BaseType {
        return this.type;
    }
}
