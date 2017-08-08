import * as ts from "typescript";
import { NodeParser } from "./NodeParser";
export interface SubNodeParser extends NodeParser {
    supportsNode(node: ts.Node): boolean;
}
