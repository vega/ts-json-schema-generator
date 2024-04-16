import { BaseType } from "../Type/BaseType.js";
import { BaseError } from "./BaseError.js";

export class UnknownTypeError extends BaseError {
    public constructor(private type: BaseType) {
        super(`Unknown type "${type.getId()}"`);
    }

    public getType(): BaseType {
        return this.type;
    }
}
