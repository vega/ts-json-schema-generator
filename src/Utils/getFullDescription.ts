import ts from "typescript";

export function getFullDescription(node: ts.Node): string | undefined {
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

function getTextWithoutStars(inputText: string) {
    const innerTextWithStars = inputText.replace(/^\/\*\*[^\S\n]*\n?/, "").replace(/(\r?\n)?[^\S\n]*\*\/$/, "");

    return innerTextWithStars
        .split(/\n/)
        .map((line) => {
            const trimmedLine = line.trimStart();

            if (trimmedLine[0] !== "*") {
                return line;
            }

            const textStartPos = trimmedLine[1] === " " ? 2 : 1;

            return trimmedLine.substring(textStartPos);
        })
        .join("\n");
}
