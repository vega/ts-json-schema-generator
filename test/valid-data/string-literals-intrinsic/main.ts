type Abort = "abort";
type Result = "ok" | "fail" | Uppercase<Abort> | "Success";
type ResultUpper = Uppercase<Result>;
type ResultLower = Lowercase<ResultUpper>;
type ResultCapitalize = Capitalize<Result>;
type ResultUncapitalize = Uncapitalize<ResultCapitalize>;

export interface MyObject {
    result: Result;
    resultUpper: ResultUpper;
    resultLower: ResultLower;
    resultCapitalize: ResultCapitalize;
    resultUncapitalize: ResultUncapitalize;
}
