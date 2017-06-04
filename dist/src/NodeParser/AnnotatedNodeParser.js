"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var ExtendedAnnotationsReader_1 = require("../AnnotationsReader/ExtendedAnnotationsReader");
var AnnotatedType_1 = require("../Type/AnnotatedType");
var AnnotatedNodeParser = (function () {
    function AnnotatedNodeParser(childNodeParser, annotationsReader) {
        this.childNodeParser = childNodeParser;
        this.annotationsReader = annotationsReader;
    }
    AnnotatedNodeParser.prototype.supportsNode = function (node) {
        return this.childNodeParser.supportsNode(node);
    };
    AnnotatedNodeParser.prototype.createType = function (node, context) {
        var baseType = this.childNodeParser.createType(node, context);
        var annotatedNode = this.getAnnotatedNode(node);
        var annotations = this.annotationsReader.getAnnotations(annotatedNode);
        var nullable = this.annotationsReader instanceof ExtendedAnnotationsReader_1.ExtendedAnnotationsReader ?
            this.annotationsReader.isNullable(annotatedNode) : false;
        return !annotations && !nullable ? baseType : new AnnotatedType_1.AnnotatedType(baseType, annotations || {}, nullable);
    };
    AnnotatedNodeParser.prototype.getAnnotatedNode = function (node) {
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
    };
    return AnnotatedNodeParser;
}());
exports.AnnotatedNodeParser = AnnotatedNodeParser;
//# sourceMappingURL=AnnotatedNodeParser.js.map