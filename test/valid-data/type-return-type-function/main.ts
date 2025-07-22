// Test cases to demonstrate ReturnType parsing with various function types

// Implicit return type
export function implicitReturn() {
    return { message: "Hello", count: 42 };
}

// Arrow function with implicit return
export const arrowImplicitReturn = () => ({
    nested: {
        value: "test",
        count: 123,
    },
});

// Function expression with implicit return
export const functionExprImplicitReturn = function () {
    return {
        dynamic: true,
        payload: { id: 456, name: "example" },
    };
};

// Complex nested return type with explicit annotation
export function complexNestedReturn(): {
    meta: {
        version: number;
        type: string;
    };
    data: string[];
} {
    return {
        meta: { version: 1, type: "test" },
        data: ["item1", "item2"],
    };
}

// Combined type that tests all function return types
export type FunctionReturnTypes = {
    implicit: ReturnType<typeof implicitReturn>;
    arrow: ReturnType<typeof arrowImplicitReturn>;
    functionExpr: ReturnType<typeof functionExprImplicitReturn>;
    complex: ReturnType<typeof complexNestedReturn>;
};
