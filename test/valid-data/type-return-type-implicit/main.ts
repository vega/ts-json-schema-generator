export function implicitReturn() {
    return { message: "Hello", count: 42 };
}

export type ImplicitReturnType = ReturnType<typeof implicitReturn>;