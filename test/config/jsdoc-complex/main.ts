/**
 * @title Some title here
 * @description Some description here
 */
export interface MyObject {
    /**
     * @title String field title
     * @minLength 10
     * @format date-time
     * @pattern /^\d+$/
     */
    stringValue: string;
    /**
     * @title Number field title
     * @maximum 10
     * @exclusiveMaximum true
     * @multipleOf 3
     */
    numberValue: number;

    /**
     * @description Export field description
     * @default {"length": 10}
     */
    exportString: MyExportString;
    /**
     * @description Export field description
     * @default "private"
     */
    privateString: MyPrivateString;

    /**
     * @title Non empty array
     */
    numberArray: MyNonEmptyArray<number>;
}

/**
 * @title My export string
 */
export type MyExportString = string;
/**
 * @title My private string
 */
type MyPrivateString = string;
/**
 * @minItems 1
 */
export type MyNonEmptyArray<T> = T[];
