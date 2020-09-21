import * as ts from "typescript";
import { symbolAtNode } from "./symbolAtNode";

export function hasJsDocTag(node: ts.Node, tagName: string): boolean {
    const symbol = symbolAtNode(node);
    return symbol ? symbol.getJsDocTags()?.some((tag) => tag.name === tagName) : false;
}
