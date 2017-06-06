"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var EnumType_1 = require("../Type/EnumType");
var EnumNodeParser = (function () {
    function EnumNodeParser(typeChecker) {
        this.typeChecker = typeChecker;
    }
    EnumNodeParser.prototype.supportsNode = function (node) {
        return node.kind === ts.SyntaxKind.EnumDeclaration || node.kind === ts.SyntaxKind.EnumMember;
    };
    EnumNodeParser.prototype.createType = function (node, context) {
        var _this = this;
        var members = node.kind === ts.SyntaxKind.EnumDeclaration ?
            node.members :
            [node];
        return new EnumType_1.EnumType("enum-" + node.getFullStart(), members.map(function (member, index) { return _this.getMemberValue(member, index); }));
    };
    EnumNodeParser.prototype.getMemberValue = function (member, index) {
        var constantValue = this.typeChecker.getConstantValue(member);
        if (constantValue !== undefined) {
            return constantValue;
        }
        var initializer = member.initializer;
        if (!initializer) {
            return index;
        }
        else if (initializer.kind === ts.SyntaxKind.NoSubstitutionTemplateLiteral) {
            return member.name.getText();
        }
        else {
            return this.parseInitializer(initializer);
        }
    };
    EnumNodeParser.prototype.parseInitializer = function (initializer) {
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
    };
    return EnumNodeParser;
}());
exports.EnumNodeParser = EnumNodeParser;
//# sourceMappingURL=EnumNodeParser.js.map