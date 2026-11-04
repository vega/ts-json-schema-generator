interface Bar {
    id: string;
    value: string;
}

export async function returnsArray() {
    return [{ bar: "a" }, { bar: "b" }];
}

export async function returnsInferred() {
    return { bar: "baz", qux: 42 };
}

export async function returnsNestedRef() {
    return { bar: {} as Bar, count: 42 };
}

export async function returnsPrimitive(): Promise<string | undefined> {
    return "bar";
}

export async function returnsUnion() {
    if (Math.random() > 0.5) {
        return { kind: "bar" as const, value: 1 };
    }
    return { kind: "baz" as const, value: "qux" };
}

export async function returnsUnresolvable() {
    return {
        name: "test",
        handler: (x: number) => x * 2,
    };
}
