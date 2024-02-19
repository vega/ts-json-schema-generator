"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunctionParser = void 0;
const typescript_1 = __importDefault(require("typescript"));
const ObjectType_1 = require("../Type/ObjectType");
const nodeKey_1 = require("../Utils/nodeKey");
const DefinitionType_1 = require("../Type/DefinitionType");
class FunctionParser {
    constructor(childNodeParser) {
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        if (node.kind === typescript_1.default.SyntaxKind.FunctionDeclaration) {
            return Boolean(node.name);
        }
        return ((node.kind === typescript_1.default.SyntaxKind.ArrowFunction || node.kind === typescript_1.default.SyntaxKind.FunctionExpression) &&
            typescript_1.default.isVariableDeclaration(node.parent));
    }
    createType(node, context) {
        const parameterTypes = node.parameters.map((parameter) => {
            return this.childNodeParser.createType(parameter, context);
        });
        const namedArguments = new ObjectType_1.ObjectType(`object-${(0, nodeKey_1.getKey)(node, context)}`, [], parameterTypes.map((parameterType, index) => {
            const required = node.parameters[index].questionToken ? false : !node.parameters[index].initializer;
            return new ObjectType_1.ObjectProperty(node.parameters[index].name.getText(), parameterType, required);
        }), false);
        return new DefinitionType_1.DefinitionType(this.getTypeName(node, context), namedArguments);
    }
    getTypeName(node, context) {
        if (typescript_1.default.isArrowFunction(node) || typescript_1.default.isFunctionExpression(node)) {
            const parent = node.parent;
            if (typescript_1.default.isVariableDeclaration(parent)) {
                return `NamedParameters<typeof ${parent.name.getText()}>`;
            }
        }
        if (typescript_1.default.isFunctionDeclaration(node)) {
            return `NamedParameters<typeof ${node.name.getText()}>`;
        }
        throw new Error("Expected to find a name for function but couldn't");
    }
}
exports.FunctionParser = FunctionParser;
//# sourceMappingURL=FunctionParser.js.map