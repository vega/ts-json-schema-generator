"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtendedAnnotationsReader = void 0;
const json5_1 = __importDefault(require("json5"));
const symbolAtNode_1 = require("../Utils/symbolAtNode");
const BasicAnnotationsReader_1 = require("./BasicAnnotationsReader");
class ExtendedAnnotationsReader extends BasicAnnotationsReader_1.BasicAnnotationsReader {
    constructor(typeChecker, extraTags, markdownDescription) {
        super(extraTags);
        this.typeChecker = typeChecker;
        this.markdownDescription = markdownDescription;
    }
    getAnnotations(node) {
        const annotations = {
            ...this.getDescriptionAnnotation(node),
            ...this.getTypeAnnotation(node),
            ...this.getExampleAnnotation(node),
            ...super.getAnnotations(node),
        };
        return Object.keys(annotations).length ? annotations : undefined;
    }
    isNullable(node) {
        const symbol = (0, symbolAtNode_1.symbolAtNode)(node);
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
        const symbol = (0, symbolAtNode_1.symbolAtNode)(node);
        if (!symbol) {
            return undefined;
        }
        const comments = symbol.getDocumentationComment(this.typeChecker);
        if (!comments || !comments.length) {
            return undefined;
        }
        const markdownDescription = comments
            .map((comment) => comment.text)
            .join(" ")
            .replace(/\r/g, "")
            .trim();
        const description = markdownDescription.replace(/(?<=[^\n])\n(?=[^\n*-])/g, " ").trim();
        return this.markdownDescription ? { description, markdownDescription } : { description };
    }
    getTypeAnnotation(node) {
        var _a;
        const symbol = (0, symbolAtNode_1.symbolAtNode)(node);
        if (!symbol) {
            return undefined;
        }
        const jsDocTags = symbol.getJsDocTags();
        if (!jsDocTags || !jsDocTags.length) {
            return undefined;
        }
        const jsDocTag = jsDocTags.find((tag) => tag.name === "asType");
        if (!jsDocTag) {
            return undefined;
        }
        const text = ((_a = jsDocTag.text) !== null && _a !== void 0 ? _a : []).map((part) => part.text).join("");
        return { type: text };
    }
    getExampleAnnotation(node) {
        var _a;
        const symbol = (0, symbolAtNode_1.symbolAtNode)(node);
        if (!symbol) {
            return undefined;
        }
        const jsDocTags = symbol.getJsDocTags();
        if (!jsDocTags || !jsDocTags.length) {
            return undefined;
        }
        const examples = [];
        for (const example of jsDocTags.filter((tag) => tag.name === "example")) {
            const text = ((_a = example.text) !== null && _a !== void 0 ? _a : []).map((part) => part.text).join("");
            try {
                examples.push(json5_1.default.parse(text));
            }
            catch (e) {
            }
        }
        if (examples.length === 0) {
            return undefined;
        }
        return { examples };
    }
}
exports.ExtendedAnnotationsReader = ExtendedAnnotationsReader;
//# sourceMappingURL=ExtendedAnnotationsReader.js.map