import * as ts from "typescript";
import { symbolAtNode } from "./symbolAtNode";

export function isHidden(symbol: ts.Symbol): boolean {
    const jsDocTags: ts.JSDocTagInfo[] = symbol.getJsDocTags();
    if (!jsDocTags || !jsDocTags.length) {
        return false;
    }

    const jsDocTag: ts.JSDocTagInfo | undefined = jsDocTags.find((tag: ts.JSDocTagInfo) => tag.name === "hide");
    return !!jsDocTag;
}

export function isNodeHidden(node: ts.Node): boolean | null {
    const symbol = symbolAtNode(node);
    if (!symbol) {
        return null;
    }

    return isHidden(symbol);
}

export function referenceHidden(typeChecker: ts.TypeChecker) {
    return function(node: ts.Node) {
        if (node.kind === ts.SyntaxKind.TypeReference) {
            return isHidden(typeChecker.getSymbolAtLocation((node as ts.TypeReferenceNode).typeName)!);
        }

        return isNodeHidden(node);
    };
}
