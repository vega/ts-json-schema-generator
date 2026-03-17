import ts from "typescript";
/**
 * Checks if given node has the given modifier.
 *
 * @param node     - The node to check.
 * @param modifier - The modifier to look for.
 * @return True if node has the modifier, false if not.
 */
export declare function hasModifier(node: ts.HasModifiers, modifier: ts.SyntaxKind): boolean;
/**
 * Checks if given node is public. A node is public if it has the public modifier or has no modifiers at all.
 *
 * @param node - The node to check.
 * @return True if node is public, false if not.
 */
export declare function isPublic(node: ts.HasModifiers): boolean;
/**
 * Checks if given node has the static modifier.
 *
 * @param node - The node to check.
 * @return True if node is static, false if not.
 */
export declare function isStatic(node: ts.HasModifiers): boolean;
