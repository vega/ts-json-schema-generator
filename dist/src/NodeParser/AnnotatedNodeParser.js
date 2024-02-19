"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnotatedNodeParser = void 0;
const typescript_1 = __importDefault(require("typescript"));
const ExtendedAnnotationsReader_1 = require("../AnnotationsReader/ExtendedAnnotationsReader");
const AnnotatedType_1 = require("../Type/AnnotatedType");
const removeUndefined_1 = require("../Utils/removeUndefined");
const DefinitionType_1 = require("../Type/DefinitionType");
const UnionType_1 = require("../Type/UnionType");
const AnyType_1 = require("../Type/AnyType");
class AnnotatedNodeParser {
    constructor(childNodeParser, annotationsReader) {
        this.childNodeParser = childNodeParser;
        this.annotationsReader = annotationsReader;
    }
    supportsNode(node) {
        return this.childNodeParser.supportsNode(node);
    }
    createType(node, context, reference) {
        var _a;
        const annotatedNode = this.getAnnotatedNode(node);
        let annotations = this.annotationsReader.getAnnotations(annotatedNode);
        const nullable = this.getNullable(annotatedNode);
        if (annotations && "$ref" in annotations) {
            return new AnnotatedType_1.AnnotatedType(new AnyType_1.AnyType(), annotations, nullable);
        }
        const baseType = this.childNodeParser.createType(node, context, reference);
        if ((_a = node.getSourceFile()) === null || _a === void 0 ? void 0 : _a.fileName.match(/[/\\]typescript[/\\]lib[/\\]lib\.[^/\\]+\.d\.ts$/i)) {
            let specialCase = false;
            if (node.kind === typescript_1.default.SyntaxKind.TypeAliasDeclaration &&
                node.name.text === "Exclude") {
                let t = context.getArgument("T");
                if (t instanceof UnionType_1.UnionType) {
                    t = (0, removeUndefined_1.removeUndefined)(t).newType;
                }
                if (t instanceof DefinitionType_1.DefinitionType) {
                    t = t.getType();
                }
                if (t instanceof AnnotatedType_1.AnnotatedType) {
                    annotations = t.getAnnotations();
                    specialCase = true;
                }
            }
            if (!specialCase) {
                return baseType;
            }
        }
        return !annotations && !nullable ? baseType : new AnnotatedType_1.AnnotatedType(baseType, annotations || {}, nullable);
    }
    getNullable(annotatedNode) {
        return this.annotationsReader instanceof ExtendedAnnotationsReader_1.ExtendedAnnotationsReader
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