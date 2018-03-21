"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BasicAnnotationsReader_1 = require("./BasicAnnotationsReader");
class ExtendedAnnotationsReader extends BasicAnnotationsReader_1.BasicAnnotationsReader {
    constructor(typeChecker) {
        super();
        this.typeChecker = typeChecker;
    }
    getAnnotations(node) {
        const annotations = Object.assign({}, this.getDescriptionAnnotation(node), this.getTypeAnnotation(node), super.getAnnotations(node));
        return Object.keys(annotations).length ? annotations : undefined;
    }
    isNullable(node) {
        const symbol = node.symbol;
        if (!symbol) {
            return false;
        }
        const jsDocTags = symbol.getJsDocTags();
        if (!jsDocTags || !jsDocTags.length) {
            return false;
        }
        const jsDocTag = jsDocTags.find((tag) => tag.name === "nullable");
        return !!jsDocTag;
    }
    getDescriptionAnnotation(node) {
        const symbol = node.symbol;
        if (!symbol) {
            return undefined;
        }
        const comments = symbol.getDocumentationComment(this.typeChecker);
        if (!comments || !comments.length) {
            return undefined;
        }
        return { description: comments.map((comment) => comment.text).join(" ") };
    }
    getTypeAnnotation(node) {
        const symbol = node.symbol;
        if (!symbol) {
            return undefined;
        }
        const jsDocTags = symbol.getJsDocTags();
        if (!jsDocTags || !jsDocTags.length) {
            return undefined;
        }
        const jsDocTag = jsDocTags.find((tag) => tag.name === "asType" || tag.name === "TJS-type");
        if (!jsDocTag || !jsDocTag.text) {
            return undefined;
        }
        return { type: jsDocTag.text };
    }
}
exports.ExtendedAnnotationsReader = ExtendedAnnotationsReader;
//# sourceMappingURL=ExtendedAnnotationsReader.js.map