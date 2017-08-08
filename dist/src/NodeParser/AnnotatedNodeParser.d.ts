import * as ts from "typescript";
import { AnnotationsReader } from "../AnnotationsReader";
import { Context } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
export declare class AnnotatedNodeParser implements SubNodeParser {
    private childNodeParser;
    private annotationsReader;
    constructor(childNodeParser: SubNodeParser, annotationsReader: AnnotationsReader);
    supportsNode(node: ts.Node): boolean;
    createType(node: ts.Node, context: Context): BaseType;
    private getAnnotatedNode(node);
}
