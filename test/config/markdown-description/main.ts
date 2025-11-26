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
     * @title Required value
     */
    requiredValue: number | string;
    /**
     * @title Nullable value
     */
    nullableValue: number | string | null;
    /**
     * @title Optional value
     */
    optionalValue: number | string | undefined;

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

    /**
     * Some more examples:
     * ```yaml
     * name: description
     * length: 42
     * ```
     */
    description: InheritedExample["description"];

    /**
     * @default ""
     */
    inheritedDescription: InheritedExample["description"];
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

interface InheritedExample {
    /**
     * We have a bit more text.
     *
     * Usage: It is possible to add markdown in the JSDoc comment.
     *
     * ```ts
     * // comment
     * async function readFile(path: string): Promise<string>;
     * ```
     *
     * It is stored raw.
     * @title description
     *
     * More comments.
     *
     */
    description: string;
}
