"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunctionNodeParser = void 0;
const typescript_1 = __importDefault(require("typescript"));
const FunctionType_1 = require("../Type/FunctionType");
class FunctionNodeParser {
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.FunctionType;
    }
    createType() {
        return new FunctionType_1.FunctionType();
    }
}
exports.FunctionNodeParser = FunctionNodeParser;
//# sourceMappingURL=FunctionNodeParser.js.map