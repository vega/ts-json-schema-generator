import ts from "typescript";
import { AnnotationsReader } from "../AnnotationsReader";
import { Context } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { ReferenceType } from "../Type/ReferenceType";
export declare class AnnotatedNodeParser implements SubNodeParser {
    protected childNodeParser: SubNodeParser;
    protected annotationsReader: AnnotationsReader;
    constructor(childNodeParser: SubNodeParser, annotationsReader: AnnotationsReader);
    supportsNode(node: ts.Node): boolean;
    createType(node: ts.Node, context: Context, reference?: ReferenceType): BaseType;
    protected getNullable(annotatedNode: ts.Node): boolean;
    protected getAnnotatedNode(node: ts.Node): ts.Node;
}
