import * as ts from "typescript";
import { symbolAtNode } from "./symbolAtNode";

export function isHidden(symbol: ts.Symbol): boolean {
    const jsDocTags: ts.JSDocTagInfo[] = symbol.getJsDocTags();
    if (!jsDocTags || !jsDocTags.length) {
        return false;
    }

    const jsDocTag: ts.JSDocTagInfo | undefined = jsDocTags.find((tag: ts.JSDocTagInfo) => tag.name === "hidden");
    return !!jsDocTag;
}

export function isNodeHidden(node: ts.Node): boolean | null {
    const symbol = symbolAtNode(node);
    if (!symbol) {
        return null;
    }

    return isHidden(symbol);
}
