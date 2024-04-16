import ts from "typescript";
import { NodeParser } from "../NodeParser.js";

export interface SubNodeParser extends NodeParser {
    supportsNode(node: ts.Node): boolean;
}
