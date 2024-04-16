type X = 'a' | 'b'

type Foo = {
    foo: X
}

export type A = Foo & {
    foo: 'a'
}

export type B = Foo & {
    foo: 'b'
}

export type MyType = A | B
