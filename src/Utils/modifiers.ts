import * as ts from "typescript";

/**
 * Checks if given node has the given modifier.
 *
 * @param node     - The node to check.
 * @param modifier - The modifier to look for.
 * @return True if node has the modifier, false if not.
 */
export function hasModifier(node: ts.Node, modifier: ts.SyntaxKind): boolean {
    const nodeModifiers = node.modifiers;
    if (nodeModifiers == null) {
        return false;
    } else {
        return nodeModifiers.some((nodeModifier) => nodeModifier.kind === modifier);
    }
}

/**
 * Checks if given node is public. A node is public if it has the public modifier or has no modifiers at all.
 *
 * @param node - The node to check.
 * @return True if node is public, false if not.
 */
export function isPublic(node: ts.Node): boolean {
    return !(hasModifier(node, ts.SyntaxKind.PrivateKeyword) || hasModifier(node, ts.SyntaxKind.ProtectedKeyword));
}

/**
 * Checks if given node has the static modifier.
 *
 * @param node - The node to check.
 * @return True if node is static, false if not.
 */
export function isStatic(node: ts.Node): boolean {
    return hasModifier(node, ts.SyntaxKind.StaticKeyword);
}
