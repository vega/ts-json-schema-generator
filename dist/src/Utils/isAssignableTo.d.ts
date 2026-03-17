import type { BaseType } from "../Type/BaseType.js";
/**
 * Checks if given source type is assignable to given target type.
 *
 * The logic of this function is heavily inspired by
 * https://github.com/runem/ts-simple-type/blob/master/src/is-assignable-to-simple-type.ts
 *
 * @param source      - The source type.
 * @param target      - The target type.
 * @param inferMap    - Optional parameter that keeps track of the inferred types.
 * @param insideTypes - Optional parameter used internally to solve circular dependencies.
 * @return True if source type is assignable to target type.
 */
export declare function isAssignableTo(target: BaseType, source: BaseType, inferMap?: Map<string, BaseType>, insideTypes?: Set<BaseType>): boolean;
