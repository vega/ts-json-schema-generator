// An explicitly typed unique symbol
const Foo: unique symbol = Symbol('foo');
// A unique symbol using type inference
const Bar = Symbol('bar');

export interface MyObject {
    foo: typeof Foo;
    bar: typeof Bar;
}
