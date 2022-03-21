import { LogicError } from "../Error/LogicError";

export default function assert(value: unknown, message: string): asserts value {
    if (!value) {
        throw new LogicError(message);
    }
}
