export class MyClass {
    // Method with explicit return type
    getData(): { id: number; name: string } {
        return { id: 1, name: "test" };
    }

    // Method with implicit return type
    getStatus() {
        return { active: true, count: 42 };
    }

    // Method with complex return type
    getNestedData(): {
        meta: { version: number; type: string };
        items: string[];
    } {
        return {
            meta: { version: 1, type: "test" },
            items: ["a", "b", "c"],
        };
    }

    // Arrow method with implicit return
    getSimple = () => ({ message: "hello" });
}

// Combined type that tests all method return types
export type MethodReturnTypes = {
    explicit: ReturnType<typeof MyClass.prototype.getData>;
    implicit: ReturnType<typeof MyClass.prototype.getStatus>;
    complex: ReturnType<typeof MyClass.prototype.getNestedData>;
    arrow: ReturnType<typeof MyClass.prototype.getSimple>;
};
