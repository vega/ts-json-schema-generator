import type ts from "typescript";

export function symbolAtNode(node: ts.Node): ts.Symbol | undefined {
    //@ts-expect-error - internal typescript API
    return node.symbol;
}
