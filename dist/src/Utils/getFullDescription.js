"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFullDescription = getFullDescription;
const tslib_1 = require("tslib");
const typescript_1 = tslib_1.__importDefault(require("typescript"));
function getFullDescription(node) {
    const sourceFile = node.getSourceFile();
    const jsDocNodes = typescript_1.default.getJSDocCommentsAndTags(node);
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
function getTextWithoutStars(inputText) {
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
//# sourceMappingURL=getFullDescription.js.map