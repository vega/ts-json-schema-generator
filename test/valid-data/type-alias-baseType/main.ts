export type TestType = "TEST";

export interface Test {
    numberVariable: TestType;
}

export interface MyInterface extends Partial<Test> {}
