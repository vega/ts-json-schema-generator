import type ts from "typescript";
import type { CompletedConfig } from "../src/Config.js";
import type { MutableParser } from "../src/MutableParser.js";
import type { NodeParser } from "../src/NodeParser.js";
export type ParserAugmentor = (parser: MutableParser) => void;
export declare function createParser(program: ts.Program, config: CompletedConfig, augmentor?: ParserAugmentor): NodeParser;
