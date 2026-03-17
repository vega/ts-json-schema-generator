"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunctionNodeParser = void 0;
exports.getNamedArguments = getNamedArguments;
exports.getTypeName = getTypeName;
const tslib_1 = require("tslib");
const typescript_1 = tslib_1.__importDefault(require("typescript"));
const FunctionType_js_1 = require("../Type/FunctionType.js");
const NeverType_js_1 = require("../Type/NeverType.js");
const DefinitionType_js_1 = require("../Type/DefinitionType.js");
const ObjectType_js_1 = require("../Type/ObjectType.js");
const nodeKey_js_1 = require("../Utils/nodeKey.js");
class FunctionNodeParser {
    childNodeParser;
    functions;
    constructor(childNodeParser, functions) {
        this.childNodeParser = childNodeParser;
        this.functions = functions;
    }
    supportsNode(node) {
        return (node.kind === typescript_1.default.SyntaxKind.FunctionType ||
            node.kind === typescript_1.default.SyntaxKind.FunctionExpression ||
            node.kind === typescript_1.default.SyntaxKind.ArrowFunction ||
            node.kind === typescript_1.default.SyntaxKind.FunctionDeclaration);
    }
    createType(node, context) {
        if (this.functions === "hide") {
            return new NeverType_js_1.NeverType();
        }
        const name = getTypeName(node);
        const func = new FunctionType_js_1.FunctionType(node, getNamedArguments(this.childNodeParser, node, context));
        return name ? new DefinitionType_js_1.DefinitionType(name, func) : func;
    }
}
exports.FunctionNodeParser = FunctionNodeParser;
function getNamedArguments(childNodeParser, node, context) {
    if (node.parameters.length === 0) {
        return undefined;
    }
    const parameterTypes = node.parameters.map((parameter) => {
        return childNodeParser.createType(parameter, context);
    });
    return new ObjectType_js_1.ObjectType(`object-${(0, nodeKey_js_1.getKey)(node, context)}`, [], parameterTypes.map((parameterType, index) => {
        // If it's missing a questionToken but has an initializer we can consider the property as not required
        const required = node.parameters[index].questionToken ? false : !node.parameters[index].initializer;
        return new ObjectType_js_1.ObjectProperty(node.parameters[index].name.getText(), parameterType, required);
    }), false);
}
function getTypeName(node) {
    if (typescript_1.default.isArrowFunction(node) || typescript_1.default.isFunctionExpression(node) || typescript_1.default.isFunctionTypeNode(node)) {
        const parent = node.parent;
        if (typescript_1.default.isVariableDeclaration(parent)) {
            return parent.name.getText();
        }
    }
    if (typescript_1.default.isFunctionDeclaration(node)) {
        return node.name?.getText();
    }
    return undefined;
}
//# sourceMappingURL=FunctionNodeParser.js.map