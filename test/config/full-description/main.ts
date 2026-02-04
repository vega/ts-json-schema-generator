/**
 * @title Raw Test Schema Interface
 * @description Top-level interface: This interface is used to test the fullDescription output.
 * It includes various formatting quirks, inline tags such as {@link SomeReference}, and multiple JSDoc sections.
 *
 * @markdownDescription **Markdown version:** Markdown description which should be <b>preserved</b>
 *
 * Additional info: Top-level details should be completely preserved in raw form.
 */
export interface MyObject {
    /**
     * @title Single-line Title and Description
     * @description Single-line comment for raw extraction.
     */
    singleLine: string;

    /**
     * @title Multiline Field Title
     * @description This is a multiline description.
     * It spans multiple lines to test the preservation of newlines.
     *
     * @note 123
     * @format date-time
     */
    multilineField: number;

    /**
     * This field has a comment without explicit tags.
     * It includes an inline reference: {@link ExampleReference} and extra text on several lines.
     *
     * The raw output should preserve this whole block as is.
     */
    noTagField: boolean;

    /**
     * @title Field with Special Formatting
     * @description   Extra spaces and indentation should be preserved.
     *
     * @pattern /^\w+$/
     */
    specialFormat: string;

    /**
     * Some initial descriptive text that is not tagged.
     *
     * @description Field with initial untagged text followed by a tag.
     * @default 42
     *
     * Further comments in the same block should be preserved entirely.
     */
    initialText: number;

    /**
     * Some *code block*:
     * ```yaml
     * name: description
     * length: 42
     * ```
     *
     * Some list:
     * - one
     * - two
     * - and three...
     *
     * @description This field tests `inline code` and <b>bold text</b>.
     *
     * Also includes an inline link: {@link https://example.com} and additional commentary.
     */
    markdownField: string;

    /**
     * @title Tag Only Field
     * @note Only raw content should be available.
     * @customTag Tag only content!
     */
    tagOnlyField: string;

    /**
     * @title Tag Only Field
     * @description
     * @note Only raw content should be available.
     * @customTag Tag only content!
     */
    tagOnlyFieldWithDescription: string;

    /** Some text */
    oneLineJsDoc: string;

    /** Some *text* - {@link https://example.com} - @see the `link` */
    oneLineJsDocComplex: string;

    /**  */
    emptyJsDoc1?: null;

    /**
     *
     */
    emptyJsDoc2?: null;

    noJsDoc?: null;

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

/**
 * @title Inherited Example Interface
 * @description This interface is used to test inherited descriptions.
 */
export interface InheritedExample {
    /**
     * This is an inherited description.
     *
     * It may include multiple at-tags:
     * @title Inherited Title
     * @description Inherited description text.
     *
     * It contains an inline link: {@link https://example.com} and additional commentary.
     */
    description: string;
}
