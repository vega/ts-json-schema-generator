import { getFullDescription } from "../../src/Utils/getFullDescription";
import ts from "typescript";

function dummyNode(jsDocComment: string): ts.Node {
    const code = `${jsDocComment}\nfunction dummy() {}`;
    const sourceFile = ts.createSourceFile("dummy.ts", code, ts.ScriptTarget.Latest, true);
    const node = sourceFile.statements.find(ts.isFunctionDeclaration);
    if (!node) {
        throw new Error("Could not create node");
    }
    return node;
}

// All white-space charachters except new-line, starting and ending with simple space
const ANY_SPACE = " \t\f\v\r\u00A0\u2028\u2029 ";

describe("getFullDescription", () => {
    it("Returns undefined if no JSDoc", () => {
        const jsdoc = "// no JSDoc";
        const result = getFullDescription(dummyNode(jsdoc));
        expect(result).toBeUndefined();
    });

    const cases = [
        {
            desc: "Removes single-space padding from a one-line JSDoc",
            jsdoc: "/** Some text */",
            expected: "Some text",
        },
        {
            desc: "Removes multiple-space padding from a one-line JSDoc",
            jsdoc: `/**${ANY_SPACE}Some text${ANY_SPACE}*/`,
            expected: "Some text",
        },
        {
            desc: "Extracts text between JSDoc markers when no padding is present",
            jsdoc: "/**Some text*/",
            expected: "Some text",
        },
        {
            desc: "Removes extra whitespace from a multi-line JSDoc with a single line of text",
            jsdoc: `
            /**
             * Some text
             */`,
            expected: "Some text",
        },
        {
            desc: "Removes irregular whitespace from a multi-line JSDoc on a single text line",
            jsdoc: `
            /**
             * ${ANY_SPACE}Some text${ANY_SPACE}
             */`,
            expected: "Some text",
        },
        {
            desc: "Extracts trimmed text from a multi-line JSDoc with a single non-empty line",
            jsdoc: `
            /** ${ANY_SPACE}
             * ${ANY_SPACE}
             * ${ANY_SPACE}Some text${ANY_SPACE}
             * ${ANY_SPACE}
             ${ANY_SPACE} */
            `,
            expected: "Some text",
        },
        {
            desc: "Processes multi-line JSDoc where some lines lack a space after the asterisk",
            jsdoc: `
            /**
             * Line 1
             *Line 2
             */`,
            expected: "Line 1\nLine 2",
        },
        {
            desc: "Preserves intentional leading and trailing spaces within text lines in a multi-line JSDoc",
            jsdoc: `
            /**
             * Line 1 ${ANY_SPACE}
             * ${ANY_SPACE}Line 2
             * ${ANY_SPACE}
             * Line 4
             */`,
            expected: `Line 1 ${ANY_SPACE}\n${ANY_SPACE}Line 2\n${ANY_SPACE}\nLine 4`,
        },
        {
            desc: "Preserves at-tags in a one-line JSDoc",
            jsdoc: `
            /** @see https://example.com */`,
            expected: `@see https://example.com`,
        },
        {
            desc: "Preserves inline at-tags in a one-line JSDoc",
            jsdoc: `
            /** {@link https://example.com} */`,
            expected: `{@link https://example.com}`,
        },
        {
            desc: "Preserves at-tags in a multi-line JSDoc",
            jsdoc: `
            /**
             * Some text
             * @see https://example.com
             * More text
             */`,
            expected: `Some text\n@see https://example.com\nMore text`,
        },
        {
            desc: "Preserves inline at-tags within a multi-line JSDoc",
            jsdoc: `
            /**
             * Some text
             * Link {@link https://example.com}
             * More text
             */`,
            expected: `Some text\nLink {@link https://example.com}\nMore text`,
        },
        {
            desc: "Handles multi-line JSDoc comments with asterisks and indentation",
            jsdoc: `
            /**
             * Some list:
             * * Item A
             * * Item B
             *   * Nested Item
             * More text
             */`,
            expected: `Some list:\n* Item A\n* Item B\n  * Nested Item\nMore text`,
        },
        {
            desc: "Preserves Unicode characters",
            jsdoc: `
            /**
             * \u2013\u2014\u2026\uD83D\uDE0A
             */`,
            expected: `\u2013\u2014\u2026\uD83D\uDE0A`,
        },
        {
            desc: "Handles case when end marker is on a new line",
            jsdoc: `
            /** Some text
            */`,
            expected: "Some text",
        },
        {
            desc: "Handles case when the content and end marker on the other line than start marker",
            jsdoc: `
            /**
            Some text */`,
            expected: "Some text",
        },
        {
            desc: "Handles case when there is no new line or space after start marker",
            jsdoc: `
            /**Some text
             */`,
            expected: "Some text",
        },
        {
            desc: "Handles case when there is no new line or space before end marker",
            jsdoc: `
            /**
             * Some text*/`,
            expected: "Some text",
        },
        {
            desc: "Preserves CRLF in multi-line JSDoc",
            jsdoc: `/**\r\n * Line 1\r\nLine 2\r\n */`,
            expected: "Line 1\r\nLine 2",
        },
        {
            desc: "Returns an empty string for an empty JSDoc",
            jsdoc: "/***/",
            expected: "",
        },
        {
            desc: "Returns an empty string for a one-line JSDoc containing only whitespace",
            jsdoc: "/** */",
            expected: "",
        },
        {
            desc: "Returns an empty string for a JSDoc with only newline characters",
            jsdoc: `/**\n\n*/`,
            expected: "",
        },
        {
            desc: "Returns an empty string for a multi-line JSDoc where all lines are empty or whitespace-only",
            jsdoc: `
            /**
             *
             * ${ANY_SPACE}
             *
             */
            `,
            expected: "",
        },
        {
            desc: "Returns an empty string for a one-line JSDoc containing only whitespace",
            jsdoc: `/**   ${ANY_SPACE}  */`,
            expected: "",
        },

        {
            desc: `Handles multi-line JSDoc where the first content lines do not begin with an asterisk`,
            jsdoc: `/**\nLine 1\nLine 2
            * Line 3
            */`,
            expected: "Line 1\nLine 2\nLine 3",
        },
        {
            desc: `Handles multi-line JSDoc where a middle line lacks an asterisk prefix`,
            jsdoc: `
            /**
             * Line 1\nLine 2
             * Line 3
             */`,
            expected: "Line 1\nLine 2\nLine 3",
        },
        {
            desc: `Handles non-standard whitespace preceding asterisks in a multi-line JSDoc`,
            jsdoc: `
            /**
            ${ANY_SPACE}*
            ${ANY_SPACE}* Some text
            ${ANY_SPACE}*
            */`,
            expected: "Some text",
        },
    ];

    it.each(cases)("$desc", ({ jsdoc, expected }) => {
        const result = getFullDescription(dummyNode(jsdoc.trim()));
        expect(result).toBe(expected);
    });
});
