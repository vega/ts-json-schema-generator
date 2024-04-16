interface SomeObject {
    abc: "foo";
    def?: "bar";
}

const obj: SomeObject = { abc: "foo" };
export type MyType = (typeof obj)["def"];
