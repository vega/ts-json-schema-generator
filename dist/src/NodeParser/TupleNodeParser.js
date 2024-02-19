"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TupleNodeParser = void 0;
const typescript_1 = __importDefault(require("typescript"));
const TupleType_1 = require("../Type/TupleType");
class TupleNodeParser {
    constructor(typeChecker, childNodeParser) {
        this.typeChecker = typeChecker;
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.TupleType;
    }
    createType(node, context) {
        return new TupleType_1.TupleType(node.elements.map((item) => {
            return this.childNodeParser.createType(item, context);
        }));
    }
}
exports.TupleNodeParser = TupleNodeParser;
//# sourceMappingURL=TupleNodeParser.js.map