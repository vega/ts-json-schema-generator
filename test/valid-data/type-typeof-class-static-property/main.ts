class Foo {
    static bar = "foo";
}

export type MyType = typeof Foo.bar;
