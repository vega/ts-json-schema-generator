import ts from "typescript";
import { Config } from "../src/Config";
import { MutableParser } from "../src/MutableParser";
import { NodeParser } from "../src/NodeParser";
export type ParserAugmentor = (parser: MutableParser) => void;
export declare function createParser(program: ts.Program, config: Config, augmentor?: ParserAugmentor): NodeParser;
