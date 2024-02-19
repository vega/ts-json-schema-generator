"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConstructorNodeParser = void 0;
const typescript_1 = __importDefault(require("typescript"));
const ConstructorType_1 = require("../Type/ConstructorType");
class ConstructorNodeParser {
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.ConstructorType;
    }
    createType() {
        return new ConstructorType_1.ConstructorType();
    }
}
exports.ConstructorNodeParser = ConstructorNodeParser;
//# sourceMappingURL=ConstructorNodeParser.js.map