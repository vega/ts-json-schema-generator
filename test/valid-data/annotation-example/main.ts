/**
 * @example
 * {
 *     "nested": "hello"
 * }
 *
 * @example An invalid example
 * {
 *     "nested": "world"
 * }
 * @example Another invalid example
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
