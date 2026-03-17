"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasModifier = hasModifier;
exports.isPublic = isPublic;
exports.isStatic = isStatic;
const tslib_1 = require("tslib");
const typescript_1 = tslib_1.__importDefault(require("typescript"));
/**
 * Checks if given node has the given modifier.
 *
 * @param node     - The node to check.
 * @param modifier - The modifier to look for.
 * @return True if node has the modifier, false if not.
 */
function hasModifier(node, modifier) {
    const nodeModifiers = node.modifiers;
    if (nodeModifiers == null) {
        return false;
    }
    else {
        return nodeModifiers.some((nodeModifier) => nodeModifier.kind === modifier);
    }
}
/**
 * Checks if given node is public. A node is public if it has the public modifier or has no modifiers at all.
 *
 * @param node - The node to check.
 * @return True if node is public, false if not.
 */
function isPublic(node) {
    return !(hasModifier(node, typescript_1.default.SyntaxKind.PrivateKeyword) || hasModifier(node, typescript_1.default.SyntaxKind.ProtectedKeyword));
}
/**
 * Checks if given node has the static modifier.
 *
 * @param node - The node to check.
 * @return True if node is static, false if not.
 */
function isStatic(node) {
    return hasModifier(node, typescript_1.default.SyntaxKind.StaticKeyword);
}
//# sourceMappingURL=modifiers.js.map