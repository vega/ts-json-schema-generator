import * as ts from "typescript";
import { Config } from "../src/Config";
import { NodeParser } from "../src/NodeParser";
export declare function createParser(program: ts.Program, config: Config): NodeParser;
