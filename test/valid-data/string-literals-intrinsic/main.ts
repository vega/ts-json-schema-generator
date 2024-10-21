type Abort = "abort";
type Result = "ok" | "fail" | Uppercase<Abort> | "Success";
type ResultUpper = Uppercase<Result>;
type ResultLower = Lowercase<ResultUpper>;
type ResultCapitalize = Capitalize<Result>;
type ResultUncapitalize = Uncapitalize<ResultCapitalize>;
type ResultUpperString = Uppercase<string>;
type ResultLowerString = Lowercase<string>;
type ResultCapitalizeString = Capitalize<string>;
type ResultUncapitalizeString = Uncapitalize<string>;

export interface MyObject {
    result: Result;
    resultUpper: ResultUpper;
    resultLower: ResultLower;
    resultCapitalize: ResultCapitalize;
    resultUncapitalize: ResultUncapitalize;
    resultUpperString: ResultUpperString;
    resultLowerString: ResultLowerString;
    resultCapitalizeString: ResultCapitalizeString;
    resultUncapitalizeString: ResultUncapitalizeString;
}
