"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConstructorNodeParser = void 0;
const tslib_1 = require("tslib");
const typescript_1 = tslib_1.__importDefault(require("typescript"));
const ConstructorType_js_1 = require("../Type/ConstructorType.js");
const NeverType_js_1 = require("../Type/NeverType.js");
const DefinitionType_js_1 = require("../Type/DefinitionType.js");
const FunctionNodeParser_js_1 = require("./FunctionNodeParser.js");
class ConstructorNodeParser {
    childNodeParser;
    functions;
    constructor(childNodeParser, functions) {
        this.childNodeParser = childNodeParser;
        this.functions = functions;
    }
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.ConstructorType;
    }
    createType(node, context) {
        if (this.functions === "hide") {
            return new NeverType_js_1.NeverType();
        }
        const name = (0, FunctionNodeParser_js_1.getTypeName)(node);
        const func = new ConstructorType_js_1.ConstructorType(node, (0, FunctionNodeParser_js_1.getNamedArguments)(this.childNodeParser, node, context));
        return name ? new DefinitionType_js_1.DefinitionType(name, func) : func;
    }
}
exports.ConstructorNodeParser = ConstructorNodeParser;
//# sourceMappingURL=ConstructorNodeParser.js.map