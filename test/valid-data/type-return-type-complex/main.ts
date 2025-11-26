// Simulated Redux Toolkit scenario
export interface TestState {
    counter: number;
    name: string;
}

export function createTestStore() {
    return {
        getState: () => ({ counter: 0, name: "test" }) as TestState,
        dispatch: (action: any) => {},
    };
}

export type TestAppStore = ReturnType<typeof createTestStore>;
export type TestAppState = ReturnType<TestAppStore["getState"]>;
