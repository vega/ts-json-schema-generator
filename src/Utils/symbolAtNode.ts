import ts from "typescript";

export function symbolAtNode(node: ts.Node): ts.Symbol | undefined {
    return (node as any).symbol;
}
export function localSymbolAtNode(node: ts.Node): ts.Symbol | undefined {
    return (node as any).localSymbol;
}
