/**
 * Hello World.
 */
export type BaseType = number | string;

export type MyType = Exclude<BaseType, string>;
