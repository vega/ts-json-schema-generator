import { ExpectationFailedTJSGError } from "../Error/Errors.js";
import type { RawType, RawTypeName } from "../Schema/RawType.js";

export function typeName(value: RawType): RawTypeName {
    if (value === null) {
        return "null";
    }

    const type = typeof value;

    if (type === "string" || type === "number" || type === "boolean") {
        return type;
    }

    if (Array.isArray(value)) {
        return "array";
    }

    if (type === "object") {
        return "object";
    }

    throw new ExpectationFailedTJSGError(`JavaScript type "typeof " can't be converted to JSON type name`);
}
