import type { BaseType } from "../Type/BaseType.js";
import { UnionType } from "../Type/UnionType.js";
/**
 * Remove undefined types from union type. Returns the number of non-undefined properties.
 */
export declare function removeUndefined(propertyType: UnionType): {
    numRemoved: number;
    newType: BaseType;
};
