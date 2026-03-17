import ts from "typescript";
import type { AnnotationsReader } from "../AnnotationsReader.js";
import type { Context } from "../NodeParser.js";
import type { SubNodeParser } from "../SubNodeParser.js";
import type { BaseType } from "../Type/BaseType.js";
import type { ReferenceType } from "../Type/ReferenceType.js";
export declare class AnnotatedNodeParser implements SubNodeParser {
    protected childNodeParser: SubNodeParser;
    protected annotationsReader: AnnotationsReader;
    constructor(childNodeParser: SubNodeParser, annotationsReader: AnnotationsReader);
    supportsNode(node: ts.Node): boolean;
    createType(node: ts.Node, context: Context, reference?: ReferenceType): BaseType;
    protected getNullable(annotatedNode: ts.Node): boolean;
    protected getAnnotatedNode(node: ts.Node): ts.Node;
}
