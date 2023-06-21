import ts from "typescript";
import { symbolAtNode } from "./symbolAtNode";

export function getJsDocTagText(node: ts.Node, tagName: string): string | undefined {
    const tags = getJsDocTagTexts(node, tagName);
    if (tags) {
        return tags[0];
    }
    return undefined;
}

export function getJsDocTagTexts(node: ts.Node, tagName: string): string[] | undefined {
    const symbol = symbolAtNode(node);
    if (!symbol) {
        return undefined;
    }

    const jsDocTags: ts.JSDocTagInfo[] = symbol.getJsDocTags();
    if (!jsDocTags || !jsDocTags.length) {
        return undefined;
    }

    const jsDocTag = jsDocTags.filter((tag) => tag.name === tagName);
    if (jsDocTag.length === 0) {
        return undefined;
    }

    return jsDocTag.map((v) => (v.text ?? []).map((part) => part.text).join(""));
}
