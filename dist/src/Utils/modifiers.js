"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isStatic = exports.isPublic = exports.hasModifier = void 0;
const typescript_1 = __importDefault(require("typescript"));
function hasModifier(node, modifier) {
    const nodeModifiers = node.modifiers;
    if (nodeModifiers == null) {
        return false;
    }
    else {
        return nodeModifiers.some((nodeModifier) => nodeModifier.kind === modifier);
    }
}
exports.hasModifier = hasModifier;
function isPublic(node) {
    return !(hasModifier(node, typescript_1.default.SyntaxKind.PrivateKeyword) || hasModifier(node, typescript_1.default.SyntaxKind.ProtectedKeyword));
}
exports.isPublic = isPublic;
function isStatic(node) {
    return hasModifier(node, typescript_1.default.SyntaxKind.StaticKeyword);
}
exports.isStatic = isStatic;
//# sourceMappingURL=modifiers.js.map