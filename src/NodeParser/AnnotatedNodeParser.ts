import * as ts from "typescript";
import { Context } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { AnnotatedType, Annotations } from "../Type/AnnotatedType";
import { AnnotationsReader } from "../AnnotationsReader";
import { ExtendedAnnotationsReader } from "../AnnotationsReader/ExtendedAnnotationsReader";

export class AnnotatedNodeParser implements SubNodeParser {
    public constructor(
        private childNodeParser: SubNodeParser,
        private annotationsReader: AnnotationsReader,
    ) {
    }

    public supportsNode(node: ts.Node): boolean {
        return this.childNodeParser.supportsNode(node);
    }
    public createType(node: ts.Node, context: Context): BaseType {
        const baseType: BaseType = this.childNodeParser.createType(node, context);
        const annotatedNode: ts.Node = this.getAnnotatedNode(node);
        const annotations: Annotations | undefined = this.annotationsReader.getAnnotations(annotatedNode);
        const nullable: boolean = this.annotationsReader instanceof ExtendedAnnotationsReader ?
            this.annotationsReader.isNullable(annotatedNode) : false;
        return !annotations && !nullable ? baseType : new AnnotatedType(baseType, annotations || {}, nullable);
    }

    private getAnnotatedNode(node: ts.Node): ts.Node {
        if (!node.parent) {
            return node;
        } else if (node.parent.kind === ts.SyntaxKind.PropertySignature) {
            return node.parent;
        } else if (node.parent.kind === ts.SyntaxKind.IndexSignature) {
            return node.parent;
        } else {
            return node;
        }
    }
}
