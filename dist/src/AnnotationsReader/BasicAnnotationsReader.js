"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BasicAnnotationsReader {
    getAnnotations(node) {
        const symbol = node.symbol;
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
                result[jsDocTag.name] = value;
            }
            return result;
        }, {});
        return Object.keys(annotations).length ? annotations : undefined;
    }
    parseJsDocTag(jsDocTag) {
        if (!jsDocTag.text) {
            return undefined;
        }
        if (BasicAnnotationsReader.textTags.indexOf(jsDocTag.name) >= 0) {
            return jsDocTag.text;
        }
        else if (BasicAnnotationsReader.jsonTags.indexOf(jsDocTag.name) >= 0) {
            return this.parseJson(jsDocTag.text);
        }
        else {
            return undefined;
        }
    }
    parseJson(value) {
        try {
            return JSON.parse(value);
        }
        catch (e) {
            return undefined;
        }
    }
}
BasicAnnotationsReader.textTags = [
    "title",
    "description",
    "format",
    "pattern",
];
BasicAnnotationsReader.jsonTags = [
    "minimum",
    "exclusiveMinimum",
    "maximum",
    "exclusiveMaximum",
    "multipleOf",
    "minLength",
    "maxLength",
    "minItems",
    "maxItems",
    "uniqueItems",
    "propertyNames",
    "contains",
    "const",
    "examples",
    "default",
];
exports.BasicAnnotationsReader = BasicAnnotationsReader;
//# sourceMappingURL=BasicAnnotationsReader.js.map