"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var ts = require("typescript");
var DiagnosticError_1 = require("../Error/DiagnosticError");
var UnknownNodeError_1 = require("../Error/UnknownNodeError");
function getSourceFile(node) {
    var sourceFile = node.parent;
    while (sourceFile) {
        if (sourceFile.kind === ts.SyntaxKind.SourceFile) {
            return sourceFile;
        }
        sourceFile = sourceFile.parent;
    }
    return undefined;
}
function getNodeLocation(node) {
    var sourceFile = getSourceFile(node);
    if (!sourceFile) {
        return ["<unknown file>", 0, 0];
    }
    var lineAndChar = ts.getLineAndCharacterOfPosition(sourceFile, node.getStart(sourceFile));
    return [sourceFile.fileName, lineAndChar.line + 1, lineAndChar.character];
}
function formatError(error) {
    if (error instanceof DiagnosticError_1.DiagnosticError) {
        var rootDir_1 = process.cwd().split(path.sep)[0] || "/";
        return ts.formatDiagnostics(error.getDiagnostics(), {
            getCanonicalFileName: function (fileName) { return fileName; },
            getCurrentDirectory: function () { return rootDir_1; },
            getNewLine: function () { return "\n"; },
        });
    }
    else if (error instanceof UnknownNodeError_1.UnknownNodeError) {
        var unknownNode = error.getReference() || error.getNode();
        var nodeFullText = unknownNode.getFullText().trim().split("\n")[0].trim();
        var _a = getNodeLocation(unknownNode), sourceFile = _a[0], lineNumber = _a[1], charPos = _a[2];
        return error.name + ": Unknown node \"" + nodeFullText + "\" (ts.SyntaxKind = " + error.getNode().kind + ") " +
            ("at " + sourceFile + "(" + lineNumber + "," + charPos + ")\n");
    }
    return error.name + ": " + error.message + "\n";
}
exports.formatError = formatError;
//# sourceMappingURL=formatError.js.map