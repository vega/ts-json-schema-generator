import ts from "typescript";
import { MutableParser } from "./MutableParser";
import { Context } from "./NodeParser";
import { SubNodeParser } from "./SubNodeParser";
import { BaseType } from "./Type/BaseType";
import { ReferenceType } from "./Type/ReferenceType";
export declare class ChainNodeParser implements SubNodeParser, MutableParser {
    protected typeChecker: ts.TypeChecker;
    protected nodeParsers: SubNodeParser[];
    protected readonly typeCaches: WeakMap<ts.Node, Map<string, BaseType>>;
    constructor(typeChecker: ts.TypeChecker, nodeParsers: SubNodeParser[]);
    addNodeParser(nodeParser: SubNodeParser): this;
    supportsNode(node: ts.Node): boolean;
    createType(node: ts.Node, context: Context, reference?: ReferenceType): BaseType;
    protected getNodeParser(node: ts.Node, context: Context): SubNodeParser;
}
