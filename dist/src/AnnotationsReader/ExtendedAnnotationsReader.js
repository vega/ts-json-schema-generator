"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtendedAnnotationsReader = void 0;
const tslib_1 = require("tslib");
const json5_1 = tslib_1.__importDefault(require("json5"));
const symbolAtNode_js_1 = require("../Utils/symbolAtNode.js");
const getFullDescription_js_1 = require("../Utils/getFullDescription.js");
const BasicAnnotationsReader_js_1 = require("./BasicAnnotationsReader.js");
class ExtendedAnnotationsReader extends BasicAnnotationsReader_js_1.BasicAnnotationsReader {
    typeChecker;
    markdownDescription;
    fullDescription;
    constructor(typeChecker, extraTags, markdownDescription, fullDescription) {
        super(extraTags);
        this.typeChecker = typeChecker;
        this.markdownDescription = markdownDescription;
        this.fullDescription = fullDescription;
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
        const symbol = (0, symbolAtNode_js_1.symbolAtNode)(node);
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
        const symbol = (0, symbolAtNode_js_1.symbolAtNode)(node);
        if (!symbol) {
            return undefined;
        }
        const annotations = {};
        const comments = symbol.getDocumentationComment(this.typeChecker);
        if (comments && comments.length) {
            const markdownDescription = comments
                .map((comment) => comment.text)
                .join(" ")
                .replace(/\r/g, "")
                .trim();
            annotations.description = markdownDescription.replace(/(?<=[^\n])\n(?=[^\n*-])/g, " ").trim();
            if (this.markdownDescription) {
                annotations.markdownDescription = markdownDescription;
            }
        }
        if (this.fullDescription) {
            const fullDescription = (0, getFullDescription_js_1.getFullDescription)(node)?.trim();
            if (fullDescription) {
                annotations.fullDescription = fullDescription;
            }
        }
        return Object.keys(annotations).length ? annotations : undefined;
    }
    getTypeAnnotation(node) {
        const symbol = (0, symbolAtNode_js_1.symbolAtNode)(node);
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
        const text = (jsDocTag.text ?? []).map((part) => part.text).join("");
        return { type: text };
    }
    /**
     * Attempts to gather examples from the @-example jsdoc tag.
     * See https://tsdoc.org/pages/tags/example/
     */
    getExampleAnnotation(node) {
        const symbol = (0, symbolAtNode_js_1.symbolAtNode)(node);
        if (!symbol) {
            return undefined;
        }
        const jsDocTags = symbol.getJsDocTags();
        if (!jsDocTags || !jsDocTags.length) {
            return undefined;
        }
        const examples = [];
        for (const example of jsDocTags.filter((tag) => tag.name === "example")) {
            const text = (example.text ?? []).map((part) => part.text).join("");
            try {
                examples.push(json5_1.default.parse(text));
            }
            catch {
                // ignore examples which don't parse to valid JSON
                // This could be improved to support a broader range of usages,
                // such as if the example has a title (as explained in the tsdoc spec).
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