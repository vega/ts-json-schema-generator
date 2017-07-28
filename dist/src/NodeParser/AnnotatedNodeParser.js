"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const ExtendedAnnotationsReader_1 = require("../AnnotationsReader/ExtendedAnnotationsReader");
const AnnotatedType_1 = require("../Type/AnnotatedType");
class AnnotatedNodeParser {
    constructor(childNodeParser, annotationsReader) {
        this.childNodeParser = childNodeParser;
        this.annotationsReader = annotationsReader;
    }
    supportsNode(node) {
        return this.childNodeParser.supportsNode(node);
    }
    createType(node, context) {
        const baseType = this.childNodeParser.createType(node, context);
        const annotatedNode = this.getAnnotatedNode(node);
        const annotations = this.annotationsReader.getAnnotations(annotatedNode);
        const nullable = this.annotationsReader instanceof ExtendedAnnotationsReader_1.ExtendedAnnotationsReader ?
            this.annotationsReader.isNullable(annotatedNode) : false;
        return !annotations && !nullable ? baseType : new AnnotatedType_1.AnnotatedType(baseType, annotations || {}, nullable);
    }
    getAnnotatedNode(node) {
        if (!node.parent) {
            return node;
        }
        else if (node.parent.kind === ts.SyntaxKind.PropertySignature) {
            return node.parent;
        }
        else if (node.parent.kind === ts.SyntaxKind.IndexSignature) {
            return node.parent;
        }
        else {
            return node;
        }
    }
}
exports.AnnotatedNodeParser = AnnotatedNodeParser;
//# sourceMappingURL=AnnotatedNodeParser.js.map