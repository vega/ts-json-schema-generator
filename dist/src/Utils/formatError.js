"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatError = void 0;
const path = __importStar(require("path"));
const typescript_1 = __importDefault(require("typescript"));
const DiagnosticError_1 = require("../Error/DiagnosticError");
const UnknownNodeError_1 = require("../Error/UnknownNodeError");
function getNodeLocation(node) {
    const sourceFile = node.getSourceFile();
    if (!sourceFile) {
        return ["<unknown file>", 0, 0];
    }
    const lineAndChar = typescript_1.default.getLineAndCharacterOfPosition(sourceFile, node.getStart(sourceFile));
    return [sourceFile.fileName, lineAndChar.line + 1, lineAndChar.character];
}
function formatError(error) {
    if (error instanceof DiagnosticError_1.DiagnosticError) {
        const rootDir = process.cwd().split(path.sep)[0] || "/";
        return typescript_1.default.formatDiagnostics(error.getDiagnostics(), {
            getCanonicalFileName: (fileName) => fileName,
            getCurrentDirectory: () => rootDir,
            getNewLine: () => "\n",
        });
    }
    else if (error instanceof UnknownNodeError_1.UnknownNodeError) {
        const unknownNode = error.getReference() || error.getNode();
        const nodeFullText = unknownNode.getFullText().trim().split("\n")[0].trim();
        const [sourceFile, lineNumber, charPos] = getNodeLocation(unknownNode);
        return (`${error.name}: Unknown node "${nodeFullText}" (ts.SyntaxKind = ${error.getNode().kind}) ` +
            `at ${sourceFile}(${lineNumber},${charPos})\n`);
    }
    return `${error.name}: ${error.message}\n`;
}
exports.formatError = formatError;
//# sourceMappingURL=formatError.js.map