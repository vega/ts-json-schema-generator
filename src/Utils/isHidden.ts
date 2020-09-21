import * as ts from "typescript";
import { hasJsDocTag } from "./hasJsDocTag";

export function isNodeHidden(node: ts.Node): boolean {
    return hasJsDocTag(node, "hidden");
}
