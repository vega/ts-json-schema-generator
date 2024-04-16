export interface A {
    a: string;
}

export interface B extends A {
    b: string;
}

export interface C extends B {
    a: string;
    c: string;
}

export interface D {
    a: number;
    d: string;
}

export interface E extends D {}

export interface F extends D {
    f: boolean;
}

export type Map<T> = T extends A
    ? "a"
    : T extends B
      ? "b"
      : T extends C
        ? "c"
        : T extends F
          ? "f"
          : T extends D
            ? "d"
            : T extends E
              ? "e"
              : "unknown";

export type MyObject = {
    a: Map<A>;
    b: Map<B>;
    c: Map<C>;
    d: Map<D>;
    e: Map<E>;
    f: Map<F>;
};
