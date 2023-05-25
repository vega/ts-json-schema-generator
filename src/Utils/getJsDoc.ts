import ts from "typescript";
import { symbolAtNode } from "./symbolAtNode";

export function getJsDocTagText(node: ts.Node, tagName: string): string | undefined {
    const symbol = symbolAtNode(node);
    if (!symbol) {
        return undefined;
    }

    const jsDocTags: ts.JSDocTagInfo[] = symbol.getJsDocTags();
    if (!jsDocTags || !jsDocTags.length) {
        return undefined;
    }

    const jsDocTag = jsDocTags.find((tag) => tag.name === tagName);
    if (!jsDocTag) {
        return undefined;
    }

    return (jsDocTag.text ?? []).map((part) => part.text).join("");
}
