import { BaseType } from "../Type/BaseType";

export function uniqueTypeArray<T extends BaseType>(types: T[]): T[] {
    let uniqueTypes = new Map<string, T>();
    for (const type of types) {
        uniqueTypes.set(type.getId(), type);
    }
    return Array.from(uniqueTypes.values());
}
