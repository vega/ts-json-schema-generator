interface A {
    a: string;
}

interface B {
    b: string;
}

interface C {
    c: string;
}

type Map<T> =
    T extends (A | B) ? "a or b" :
    "unknown";

export type MyObject = {
    a: Map<A>;
    b: Map<B>;
    c: Map<C>;
    d: Map<A | B>;
};
