import type { BaseType } from "../Type/BaseType.js";
/**
 * Dereference the type as far as possible.
 */
export declare function derefType(type: BaseType): BaseType;
export declare function derefAnnotatedType(type: BaseType): BaseType;
export declare function isHiddenType(type: BaseType): boolean;
/**
 * Recursively checks whether the given type is a union composed entirely of literal types.
 */
export declare function isDeepLiteralUnion(type: BaseType): boolean;
export declare function derefAliasedType(type: BaseType): BaseType;
