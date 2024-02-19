"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasicAnnotationsReader = void 0;
const json5_1 = __importDefault(require("json5"));
const symbolAtNode_1 = require("../Utils/symbolAtNode");
class BasicAnnotationsReader {
    constructor(extraTags) {
        this.extraTags = extraTags;
    }
    getAnnotations(node) {
        const symbol = (0, symbolAtNode_1.symbolAtNode)(node);
        if (!symbol) {
            return undefined;
        }
        const jsDocTags = symbol.getJsDocTags();
        if (!jsDocTags || !jsDocTags.length) {
            return undefined;
        }
        const annotations = jsDocTags.reduce((result, jsDocTag) => {
            const value = this.parseJsDocTag(jsDocTag);
            if (value !== undefined) {
                const tagName = BasicAnnotationsReader.requiresDollar.has(jsDocTag.name) ? "$" + jsDocTag.name : jsDocTag.name;
                if (result[tagName]) {
                    if (!Array.isArray(result[tagName])) {
                        result[tagName] = [result[tagName]];
                    }
                    result[tagName].push(value);
                }
                else {
                    result[tagName] = value;
                }
            }
            return result;
        }, {});
        return Object.keys(annotations).length ? annotations : undefined;
    }
    parseJsDocTag(jsDocTag) {
        var _a, _b;
        const isTextTag = BasicAnnotationsReader.textTags.has(jsDocTag.name);
        const defaultText = isTextTag ? "" : "true";
        const text = ((_a = jsDocTag.text) === null || _a === void 0 ? void 0 : _a.map((part) => part.text).join("")) || defaultText;
        if (isTextTag) {
            return text;
        }
        let parsed = this.parseJson(text);
        parsed = parsed === undefined ? text : parsed;
        if (BasicAnnotationsReader.jsonTags.has(jsDocTag.name)) {
            return parsed;
        }
        else if ((_b = this.extraTags) === null || _b === void 0 ? void 0 : _b.has(jsDocTag.name)) {
            return parsed;
        }
        else {
            return undefined;
        }
    }
    parseJson(value) {
        try {
            return json5_1.default.parse(value);
        }
        catch (e) {
            return undefined;
        }
    }
}
exports.BasicAnnotationsReader = BasicAnnotationsReader;
BasicAnnotationsReader.requiresDollar = new Set(["id", "comment", "ref"]);
BasicAnnotationsReader.textTags = new Set([
    "title",
    "description",
    "id",
    "format",
    "pattern",
    "ref",
    "comment",
    "contentMediaType",
    "contentEncoding",
    "discriminator",
]);
BasicAnnotationsReader.jsonTags = new Set([
    "minimum",
    "exclusiveMinimum",
    "maximum",
    "exclusiveMaximum",
    "multipleOf",
    "minLength",
    "maxLength",
    "minProperties",
    "maxProperties",
    "minItems",
    "maxItems",
    "uniqueItems",
    "propertyNames",
    "contains",
    "const",
    "examples",
    "default",
    "required",
    "if",
    "then",
    "else",
    "readOnly",
    "writeOnly",
    "deprecated",
]);
//# sourceMappingURL=BasicAnnotationsReader.js.map