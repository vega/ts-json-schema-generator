"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const ts = require("typescript");
const DiagnosticError_1 = require("../Error/DiagnosticError");
const UnknownNodeError_1 = require("../Error/UnknownNodeError");
function getSourceFile(node) {
    let sourceFile = node.parent;
    while (sourceFile) {
        if (sourceFile.kind === ts.SyntaxKind.SourceFile) {
            return sourceFile;
        }
        sourceFile = sourceFile.parent;
    }
    return undefined;
}
function getNodeLocation(node) {
    const sourceFile = getSourceFile(node);
    if (!sourceFile) {
        return ["<unknown file>", 0, 0];
    }
    const lineAndChar = ts.getLineAndCharacterOfPosition(sourceFile, node.getStart(sourceFile));
    return [sourceFile.fileName, lineAndChar.line + 1, lineAndChar.character];
}
function formatError(error) {
    if (error instanceof DiagnosticError_1.DiagnosticError) {
        const rootDir = process.cwd().split(path.sep)[0] || "/";
        return ts.formatDiagnostics(error.getDiagnostics(), {
            getCanonicalFileName: (fileName) => fileName,
            getCurrentDirectory: () => rootDir,
            getNewLine: () => "\n",
        });
    }
    else if (error instanceof UnknownNodeError_1.UnknownNodeError) {
        const unknownNode = error.getReference() || error.getNode();
        const nodeFullText = unknownNode.getFullText().trim().split("\n")[0].trim();
        const [sourceFile, lineNumber, charPos] = getNodeLocation(unknownNode);
        return `${error.name}: Unknown node "${nodeFullText}" (ts.SyntaxKind = ${error.getNode().kind}) ` +
            `at ${sourceFile}(${lineNumber},${charPos})\n`;
    }
    return `${error.name}: ${error.message}\n`;
}
exports.formatError = formatError;
//# sourceMappingURL=formatError.js.map