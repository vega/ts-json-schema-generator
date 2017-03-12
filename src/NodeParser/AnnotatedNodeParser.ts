import * as ts from "typescript";
import { Context } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { AnnotatedType, Annotations } from "../Type/AnnotatedType";
import { AnnotationsReader } from "../AnnotationsReader";

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
        const annotations: Annotations = this.annotationsReader.getAnnotations(this.getAnnotatedNode(node));
        return !annotations ? baseType : new AnnotatedType(baseType, annotations);
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
