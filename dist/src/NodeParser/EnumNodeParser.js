"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumNodeParser = void 0;
const typescript_1 = __importDefault(require("typescript"));
const EnumType_1 = require("../Type/EnumType");
const isHidden_1 = require("../Utils/isHidden");
const nodeKey_1 = require("../Utils/nodeKey");
class EnumNodeParser {
    constructor(typeChecker) {
        this.typeChecker = typeChecker;
    }
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.EnumDeclaration || node.kind === typescript_1.default.SyntaxKind.EnumMember;
    }
    createType(node, context) {
        const members = node.kind === typescript_1.default.SyntaxKind.EnumDeclaration ? node.members.slice() : [node];
        return new EnumType_1.EnumType(`enum-${(0, nodeKey_1.getKey)(node, context)}`, members
            .filter((member) => !(0, isHidden_1.isNodeHidden)(member))
            .map((member, index) => this.getMemberValue(member, index)));
    }
    getMemberValue(member, index) {
        const constantValue = this.typeChecker.getConstantValue(member);
        if (constantValue !== undefined) {
            return constantValue;
        }
        const initializer = member.initializer;
        if (!initializer) {
            return index;
        }
        else if (initializer.kind === typescript_1.default.SyntaxKind.NoSubstitutionTemplateLiteral) {
            return member.name.getText();
        }
        else {
            return this.parseInitializer(initializer);
        }
    }
    parseInitializer(initializer) {
        if (initializer.kind === typescript_1.default.SyntaxKind.TrueKeyword) {
            return true;
        }
        else if (initializer.kind === typescript_1.default.SyntaxKind.FalseKeyword) {
            return false;
        }
        else if (initializer.kind === typescript_1.default.SyntaxKind.NullKeyword) {
            return null;
        }
        else if (initializer.kind === typescript_1.default.SyntaxKind.StringLiteral) {
            return initializer.text;
        }
        else if (initializer.kind === typescript_1.default.SyntaxKind.ParenthesizedExpression) {
            return this.parseInitializer(initializer.expression);
        }
        else if (initializer.kind === typescript_1.default.SyntaxKind.AsExpression) {
            return this.parseInitializer(initializer.expression);
        }
        else if (initializer.kind === typescript_1.default.SyntaxKind.TypeAssertionExpression) {
            return this.parseInitializer(initializer.expression);
        }
        else {
            return initializer.getText();
        }
    }
}
exports.EnumNodeParser = EnumNodeParser;
//# sourceMappingURL=EnumNodeParser.js.map