import type ts from "typescript";

export function symbolAtNode(node: ts.Node): ts.Symbol | undefined {
    return (node as ts.Declaration).symbol;
}
