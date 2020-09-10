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
     * This field is of integer type.
     * Integer!
     *
     * The type of this field is integer.
     *
     * @title Number field title
     * @exclusiveMaximum 10
     * @multipleOf 3
     * @asType integer
     */
    numberValue: number;

    /**
     * Some ignored comment description
     *
     * @description Export field description
     * @default {"length": 10}
     * @nullable
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

    /**
     * @nullable
     */
    number: number;
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
