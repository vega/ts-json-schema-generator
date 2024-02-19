"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnionNodeParser = void 0;
const typescript_1 = __importDefault(require("typescript"));
const UnionType_1 = require("../Type/UnionType");
const notNever_1 = require("../Utils/notNever");
const NeverType_1 = require("../Type/NeverType");
class UnionNodeParser {
    constructor(typeChecker, childNodeParser) {
        this.typeChecker = typeChecker;
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.UnionType;
    }
    createType(node, context) {
        const types = node.types
            .map((subnode) => {
            return this.childNodeParser.createType(subnode, context);
        })
            .filter(notNever_1.notNever);
        if (types.length === 1) {
            return types[0];
        }
        else if (types.length === 0) {
            return new NeverType_1.NeverType();
        }
        return new UnionType_1.UnionType(types);
    }
}
exports.UnionNodeParser = UnionNodeParser;
//# sourceMappingURL=UnionNodeParser.js.map