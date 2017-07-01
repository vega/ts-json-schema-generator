import * as ts from "typescript";

export function isHidden(symbol: ts.Symbol): boolean {
    const jsDocTags: ts.JSDocTagInfo[] = symbol.getJsDocTags();
    if (!jsDocTags || !jsDocTags.length) {
        return false;
    }

    const jsDocTag: ts.JSDocTagInfo | undefined = jsDocTags.find(
        (tag: ts.JSDocTagInfo) => tag.name === "hide");
    return !!jsDocTag;
}
