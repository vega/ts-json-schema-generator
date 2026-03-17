import type ts from "typescript";
import type { NodeParser } from "../NodeParser.js";
export interface SubNodeParser extends NodeParser {
    supportsNode(node: ts.Node): boolean;
}
