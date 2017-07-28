"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const EnumType_1 = require("../Type/EnumType");
const isHidden_1 = require("../Utils/isHidden");
function isMemberHidden(member) {
    if (!("symbol" in member)) {
        return false;
    }
    const symbol = member.symbol;
    return isHidden_1.isHidden(symbol);
}
class EnumNodeParser {
    constructor(typeChecker) {
        this.typeChecker = typeChecker;
    }
    supportsNode(node) {
        return node.kind === ts.SyntaxKind.EnumDeclaration || node.kind === ts.SyntaxKind.EnumMember;
    }
    createType(node, context) {
        const members = node.kind === ts.SyntaxKind.EnumDeclaration ?
            node.members :
            [node];
        return new EnumType_1.EnumType(`enum-${node.getFullStart()}`, members
            .filter((member) => !isMemberHidden(member))
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
        else if (initializer.kind === ts.SyntaxKind.NoSubstitutionTemplateLiteral) {
            return member.name.getText();
        }
        else {
            return this.parseInitializer(initializer);
        }
    }
    parseInitializer(initializer) {
        if (initializer.kind === ts.SyntaxKind.TrueKeyword) {
            return true;
        }
        else if (initializer.kind === ts.SyntaxKind.FalseKeyword) {
            return false;
        }
        else if (initializer.kind === ts.SyntaxKind.NullKeyword) {
            return null;
        }
        else if (initializer.kind === ts.SyntaxKind.StringLiteral) {
            return initializer.text;
        }
        else if (initializer.kind === ts.SyntaxKind.ParenthesizedExpression) {
            return this.parseInitializer(initializer.expression);
        }
        else if (initializer.kind === ts.SyntaxKind.AsExpression) {
            return this.parseInitializer(initializer.expression);
        }
        else if (initializer.kind === ts.SyntaxKind.TypeAssertionExpression) {
            return this.parseInitializer(initializer.expression);
        }
        else {
            return initializer.getText();
        }
    }
}
exports.EnumNodeParser = EnumNodeParser;
//# sourceMappingURL=EnumNodeParser.js.map