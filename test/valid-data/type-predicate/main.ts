// Named function declarations with type predicates
function isString(value: unknown): value is string {
    return typeof value === "string";
}

function assertIsString(value: unknown): asserts value is string {
    if (typeof value !== "string") {
        throw new Error("Not a string");
    }
}

function assertTruthy(value: unknown): asserts value {
    if (!value) {
        throw new Error("Not truthy");
    }
}

// Arrow function with type predicate
const isNumber = (value: unknown): value is number => typeof value === "number";

// Interface using typeof
export interface MyObject {
    isString: typeof isString;
    assertIsString: typeof assertIsString;
    assertTruthy: typeof assertTruthy;
    name: string;
}

// Inline function type literals with type predicates
export interface WithInlinePredicates {
    check: (value: unknown) => value is string;
    assert: (value: unknown) => asserts value;
    assertIs: (value: unknown) => asserts value is number;
}

// this-based type predicates
export interface MyClass {
    isValid(): this is MyClass & { valid: true };
}
