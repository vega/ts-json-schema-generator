import type ts from "typescript";
import type { MutableParser } from "./MutableParser.js";
import type { Context } from "./NodeParser.js";
import type { SubNodeParser } from "./SubNodeParser.js";
import type { BaseType } from "./Type/BaseType.js";
import { ReferenceType } from "./Type/ReferenceType.js";
export declare class ChainNodeParser implements SubNodeParser, MutableParser {
    protected typeChecker: ts.TypeChecker;
    protected nodeParsers: SubNodeParser[];
    protected readonly typeCaches: WeakMap<ts.Node, Map<string, BaseType>>;
    constructor(typeChecker: ts.TypeChecker, nodeParsers: SubNodeParser[]);
    addNodeParser(nodeParser: SubNodeParser): this;
    supportsNode(node: ts.Node): boolean;
    createType(node: ts.Node, context: Context, reference?: ReferenceType): BaseType;
    protected getNodeParser(node: ts.Node): SubNodeParser;
}
