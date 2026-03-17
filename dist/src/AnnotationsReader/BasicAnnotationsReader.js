"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasicAnnotationsReader = void 0;
const tslib_1 = require("tslib");
const json5_1 = tslib_1.__importDefault(require("json5"));
const symbolAtNode_js_1 = require("../Utils/symbolAtNode.js");
class BasicAnnotationsReader {
    extraTags;
    static requiresDollar = new Set(["id", "comment", "ref"]);
    static textTags = new Set([
        "title",
        "description",
        "id",
        "format",
        "pattern",
        "ref",
        // New since draft-07:
        "comment",
        "contentMediaType",
        "contentEncoding",
        // Custom tag for if-then-else support.
        "discriminator",
    ]);
    static jsonTags = new Set([
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
        // New since draft-07:
        "if",
        "then",
        "else",
        "readOnly",
        "writeOnly",
        // New since draft 2019-09:
        "deprecated",
    ]);
    constructor(extraTags) {
        this.extraTags = extraTags;
    }
    getAnnotations(node) {
        const symbol = (0, symbolAtNode_js_1.symbolAtNode)(node);
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
                if (BasicAnnotationsReader.requiresDollar.has(jsDocTag.name)) {
                    result["$" + jsDocTag.name] = value;
                }
                else {
                    result[jsDocTag.name] = value;
                }
            }
            return result;
        }, {});
        return Object.keys(annotations).length ? annotations : undefined;
    }
    parseJsDocTag(jsDocTag) {
        const isTextTag = BasicAnnotationsReader.textTags.has(jsDocTag.name);
        // Non-text tags without explicit value (e.g. `@deprecated`) default to `true`.
        const defaultText = isTextTag ? "" : "true";
        const text = jsDocTag.text?.map((part) => part.text).join("") || defaultText;
        if (isTextTag) {
            return text;
        }
        let parsed = this.parseJson(text);
        parsed = parsed === undefined ? text : parsed;
        if (BasicAnnotationsReader.jsonTags.has(jsDocTag.name)) {
            return parsed;
        }
        else if (this.extraTags?.has(jsDocTag.name)) {
            return parsed;
        }
        else {
            // Unknown jsDoc tag.
            return undefined;
        }
    }
    parseJson(value) {
        try {
            return json5_1.default.parse(value);
        }
        catch {
            return undefined;
        }
    }
}
exports.BasicAnnotationsReader = BasicAnnotationsReader;
//# sourceMappingURL=BasicAnnotationsReader.js.map