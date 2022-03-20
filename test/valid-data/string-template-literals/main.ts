type Result = "ok" | "fail" | `abort`;

export interface MyObject {
    foo: Result;
}
