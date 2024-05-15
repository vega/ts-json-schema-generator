import { RawType, RawTypeName } from "../Schema/RawType.js";

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
    } else if (type === "object") {
        return "object";
    } else {
        throw new Error(`JavaScript type "${type}" can't be converted to JSON type name`);
    }
}
