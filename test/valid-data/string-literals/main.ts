type result = "ok" | "fail" | "abort";

export interface MyObject {
    foo: result;
    bar: result | string;
}
