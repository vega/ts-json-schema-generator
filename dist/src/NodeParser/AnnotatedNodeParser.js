"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnotatedNodeParser = void 0;
const tslib_1 = require("tslib");
const typescript_1 = tslib_1.__importDefault(require("typescript"));
const ExtendedAnnotationsReader_js_1 = require("../AnnotationsReader/ExtendedAnnotationsReader.js");
const AnnotatedType_js_1 = require("../Type/AnnotatedType.js");
const removeUndefined_js_1 = require("../Utils/removeUndefined.js");
const DefinitionType_js_1 = require("../Type/DefinitionType.js");
const UnionType_js_1 = require("../Type/UnionType.js");
const AnyType_js_1 = require("../Type/AnyType.js");
class AnnotatedNodeParser {
    childNodeParser;
    annotationsReader;
    constructor(childNodeParser, annotationsReader) {
        this.childNodeParser = childNodeParser;
        this.annotationsReader = annotationsReader;
    }
    supportsNode(node) {
        return this.childNodeParser.supportsNode(node);
    }
    createType(node, context, reference) {
        const annotatedNode = this.getAnnotatedNode(node);
        let annotations = this.annotationsReader.getAnnotations(annotatedNode);
        const nullable = this.getNullable(annotatedNode);
        // Short-circuit parsing the underlying type if an explicit ref annotation was passed.
        if (annotations && "$ref" in annotations) {
            return new AnnotatedType_js_1.AnnotatedType(new AnyType_js_1.AnyType(), annotations, nullable);
        }
        const baseType = this.childNodeParser.createType(node, context, reference);
        // Don't return annotations for lib types such as Exclude.
        // Sourceless nodes may not have a fileName, just ignore them.
        if (node.getSourceFile()?.fileName.match(/[/\\]typescript[/\\]lib[/\\]lib\.[^/\\]+\.d\.ts$/i)) {
            let specialCase = false;
            // Special case for Exclude<T, U>: use the annotation of T.
            if (node.kind === typescript_1.default.SyntaxKind.TypeAliasDeclaration &&
                node.name.text === "Exclude") {
                let t = context.getArgument("T");
                // Handle optional properties.
                if (t instanceof UnionType_js_1.UnionType) {
                    t = (0, removeUndefined_js_1.removeUndefined)(t).newType;
                }
                if (t instanceof DefinitionType_js_1.DefinitionType) {
                    t = t.getType();
                }
                if (t instanceof AnnotatedType_js_1.AnnotatedType) {
                    annotations = t.getAnnotations();
                    specialCase = true;
                }
            }
            if (!specialCase) {
                return baseType;
            }
        }
        return !annotations && !nullable ? baseType : new AnnotatedType_js_1.AnnotatedType(baseType, annotations || {}, nullable);
    }
    getNullable(annotatedNode) {
        return this.annotationsReader instanceof ExtendedAnnotationsReader_js_1.ExtendedAnnotationsReader
            ? this.annotationsReader.isNullable(annotatedNode)
            : false;
    }
    getAnnotatedNode(node) {
        if (!node.parent) {
            return node;
        }
        else if (node.parent.kind === typescript_1.default.SyntaxKind.PropertySignature) {
            return node.parent;
        }
        else if (node.parent.kind === typescript_1.default.SyntaxKind.PropertyDeclaration) {
            return node.parent;
        }
        else if (node.parent.kind === typescript_1.default.SyntaxKind.IndexSignature) {
            return node.parent;
        }
        else if (node.parent.kind === typescript_1.default.SyntaxKind.Parameter) {
            return node.parent;
        }
        else {
            return node;
        }
    }
}
exports.AnnotatedNodeParser = AnnotatedNodeParser;
//# sourceMappingURL=AnnotatedNodeParser.js.map