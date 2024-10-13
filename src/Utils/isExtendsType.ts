import ts from "typescript";

/**
 * Recursively checks each parent of the given node to determine if it is part of an extends type in a conditional type.
 *
 * @param node - The node to check.
 * @returns Whether the given node is part of an extends type.
 */
export function isExtendsType(node: ts.Node | undefined): boolean {
    if (!node) {
        return false;
    }

    let current = node;

    while (current.parent) {
        if (ts.isConditionalTypeNode(current.parent)) {
            const conditionalNode = current.parent;
            if (conditionalNode.extendsType === current) {
                return true;
            }
        }
        current = current.parent;
    }

    return false;
}
