export type MyObject = ConditionalGeneric;

export type ConditionalGeneric<T = string extends 'foo' ? 'bar' : 'baz'> = {
    foo: T;
}
