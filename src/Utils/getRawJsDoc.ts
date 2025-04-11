// Portions from ts-morph - https://github.com/dsherret/ts-morph (c) 2017 David Sherret, MIT
import ts from "typescript";

export function getRawJsDoc(node: ts.Node): string | undefined {
    const sourceFile = node.getSourceFile();
    const jsDocNodes = ts.getJSDocCommentsAndTags(node);

    if (!jsDocNodes || jsDocNodes.length === 0) {
        return undefined;
    }

    let rawText = "";

    for (const jsDoc of jsDocNodes) {
        rawText += jsDoc.getFullText(sourceFile) + "\n";
    }

    rawText = rawText.trim();

    return getTextWithoutStars(rawText).trim();
}

const regExWhitespaceSet = new Set(
    [" ", "\f", "\n", "\r", "\t", "\v", "\u00A0", "\u2028", "\u2029"].map((c) => c.charCodeAt(0)),
);

const CharCodes = {
    ASTERISK: "*".charCodeAt(0),
    NEWLINE: "\n".charCodeAt(0),
    CARRIAGE_RETURN: "\r".charCodeAt(0),
    SPACE: " ".charCodeAt(0),
    TAB: "\t".charCodeAt(0),
    CLOSE_BRACE: "}".charCodeAt(0),
};

function isWhitespaceCharCode(charCode: number) {
    return regExWhitespaceSet.has(charCode);
}

function getStarPosIfFirstNonWhitespaceChar(text: string) {
    for (let i = 0; i < text.length; i++) {
        const charCode = text.charCodeAt(i);

        if (charCode === CharCodes.ASTERISK) {
            return i;
        } else if (!isWhitespaceCharCode(charCode)) {
            break;
        }
    }
    return -1;
}

function getTextWithoutStars(inputText: string) {
    const innerTextWithStars = inputText.replace(/^\/\*\*[^\S\n]*\n?/, "").replace(/(\r?\n)?[^\S\n]*\*\/$/, "");

    return innerTextWithStars
        .split(/\n/)
        .map((line) => {
            const starPos = getStarPosIfFirstNonWhitespaceChar(line);

            if (starPos === -1) {
                return line;
            }

            const substringStart = line[starPos + 1] === " " ? starPos + 2 : starPos + 1;

            return line.substring(substringStart);
        })
        .join("\n");
}
