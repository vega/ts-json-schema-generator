import ts from "typescript";
import { hasJsDocTag } from "./hasJsDocTag.js";

export function isNodeHidden(node: ts.Node): boolean {
    return hasJsDocTag(node, "hidden");
}
