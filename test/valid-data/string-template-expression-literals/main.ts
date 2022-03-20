type OK = "ok";
type Result = OK | "fail" | `abort`;
type PrivateResultId = `__${Result}_id`;

export interface MyObject {
    foo: Result;
    _foo: PrivateResultId;
}
