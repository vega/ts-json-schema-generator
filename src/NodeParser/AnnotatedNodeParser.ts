import * as ts from "typescript";
import { AnnotationsReader } from "../AnnotationsReader";
import { ExtendedAnnotationsReader } from "../AnnotationsReader/ExtendedAnnotationsReader";
import { Context } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { AnnotatedType, Annotations } from "../Type/AnnotatedType";
import { BaseType } from "../Type/BaseType";
import { ReferenceType } from "../Type/ReferenceType";

export class AnnotatedNodeParser implements SubNodeParser {
    public constructor(
        private childNodeParser: SubNodeParser,
        private annotationsReader: AnnotationsReader,
    ) {
    }

    public supportsNode(node: ts.Node): boolean {
        return this.childNodeParser.supportsNode(node);
    }

    public createType(node: ts.Node, context: Context, reference?: ReferenceType): BaseType {
        const baseType = this.childNodeParser.createType(node, context, reference);
        const annotatedNode = this.getAnnotatedNode(node);
        const annotations = this.annotationsReader.getAnnotations(annotatedNode);
        const nullable = this.annotationsReader instanceof ExtendedAnnotationsReader ?
            this.annotationsReader.isNullable(annotatedNode) : false;
        return !annotations && !nullable ? baseType : new AnnotatedType(baseType, annotations || {}, nullable);
    }

    private getAnnotatedNode(node: ts.Node): ts.Node {
        if (!node.parent) {
            return node;
        } else if (node.parent.kind === ts.SyntaxKind.PropertySignature) {
            return node.parent;
        } else if (node.parent.kind === ts.SyntaxKind.PropertyDeclaration) {
            return node.parent;
        } else if (node.parent.kind === ts.SyntaxKind.IndexSignature) {
            return node.parent;
        } else if (node.parent.kind === ts.SyntaxKind.Parameter) {
            return node.parent;
        } else {
            return node;
        }
    }
}
