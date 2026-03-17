import type { BaseType } from "../Type/BaseType.js";
/**
 * Narrows the given type by passing all variants to the given predicate function. So when type is a union type then
 * the predicate function is called for each type within the union and only the types for which this function returns
 * true will remain in the returned type. Union types with only one sub type left are replaced by this one-and-only
 * type. Empty union types are removed completely. Definition types are kept if possible. When in the end none of
 * the type candidates match the predicate then undefined is returned.
 *
 * @param type      - The type to narrow down.
 * @param predicate - The predicate function to filter the type variants. If it returns true then the type variant is
 *                    kept, when returning false it is removed.
 * @return The narrowed down type.
 */
export declare function narrowType(type: BaseType, predicate: (type: BaseType) => boolean): BaseType;
