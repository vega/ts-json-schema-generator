"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnionNodeParser = void 0;
const tslib_1 = require("tslib");
const typescript_1 = tslib_1.__importDefault(require("typescript"));
const UnionType_js_1 = require("../Type/UnionType.js");
const notNever_js_1 = require("../Utils/notNever.js");
const NeverType_js_1 = require("../Type/NeverType.js");
class UnionNodeParser {
    typeChecker;
    childNodeParser;
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
            .filter(notNever_js_1.notNever);
        if (types.length === 1) {
            return types[0];
        }
        else if (types.length === 0) {
            return new NeverType_js_1.NeverType();
        }
        return new UnionType_js_1.UnionType(types);
    }
}
exports.UnionNodeParser = UnionNodeParser;
//# sourceMappingURL=UnionNodeParser.js.map