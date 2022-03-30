/**
 * @example
 * {
 *     "nested": "hello"
 * }
 *
 * @example Another example
 * {
 *     "nested": "world"
 * }
 * @example Last example
 * ```ts
 * {
 *     "nested": "world"
 * }
 * ```
 */
export interface MyObject {
    /**
     * @example
     *     "Hello world"
     * @example
     *     "This string rocks"
     */
    nested: MyNestedObject
}

/**
 * @example With a string
 *      "Hello string"
 */
export type MyNestedObject = string;
