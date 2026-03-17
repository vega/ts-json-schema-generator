"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumNodeParser = void 0;
const tslib_1 = require("tslib");
const typescript_1 = tslib_1.__importDefault(require("typescript"));
const EnumType_js_1 = require("../Type/EnumType.js");
const isHidden_js_1 = require("../Utils/isHidden.js");
const nodeKey_js_1 = require("../Utils/nodeKey.js");
class EnumNodeParser {
    typeChecker;
    constructor(typeChecker) {
        this.typeChecker = typeChecker;
    }
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.EnumDeclaration || node.kind === typescript_1.default.SyntaxKind.EnumMember;
    }
    createType(node, context) {
        const members = node.kind === typescript_1.default.SyntaxKind.EnumDeclaration ? node.members.slice() : [node];
        return new EnumType_js_1.EnumType(`enum-${(0, nodeKey_js_1.getKey)(node, context)}`, members
            .filter((member) => !(0, isHidden_js_1.isNodeHidden)(member))
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