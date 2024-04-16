import { LogicError } from "../Error/LogicError.js";

export default function assert(value: unknown, message: string): asserts value {
    if (!value) {
        throw new LogicError(message);
    }
}
