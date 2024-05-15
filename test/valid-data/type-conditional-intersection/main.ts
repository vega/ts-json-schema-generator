interface A {
    a: string;
}

interface B {
    b: string;
}

interface C extends A, B {}

interface D extends A, B {
    d: string;
}

type Map<T> = T extends D
    ? "D"
    : T extends A & B
      ? "a and b"
      : T extends A
        ? "a"
        : T extends B
          ? "b"
          : T extends C
            ? "c"
            : "unknown";

export type MyObject = {
    a: Map<A>;
    b: Map<B>;
    c: Map<C>;
    d: Map<D>;
    e: Map<A & B>;
    f: Map<A & B & D>;
};
