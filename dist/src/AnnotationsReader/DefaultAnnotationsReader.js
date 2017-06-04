"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DefaultAnnotationsReader = (function () {
    function DefaultAnnotationsReader() {
    }
    DefaultAnnotationsReader.prototype.getAnnotations = function (node) {
        var _this = this;
        var symbol = node.symbol;
        if (!symbol) {
            return undefined;
        }
        var jsDocTags = symbol.getJsDocTags();
        if (!jsDocTags || !jsDocTags.length) {
            return undefined;
        }
        var annotations = jsDocTags.reduce(function (result, jsDocTag) {
            var value = _this.parseJsDocTag(jsDocTag);
            if (value !== undefined) {
                result[jsDocTag.name] = value;
            }
            return result;
        }, {});
        return Object.keys(annotations).length ? annotations : undefined;
    };
    DefaultAnnotationsReader.prototype.parseJsDocTag = function (jsDocTag) {
        if (!jsDocTag.text) {
            return undefined;
        }
        if (DefaultAnnotationsReader.textTags.indexOf(jsDocTag.name) >= 0) {
            return jsDocTag.text;
        }
        else if (DefaultAnnotationsReader.jsonTags.indexOf(jsDocTag.name) >= 0) {
            return this.parseJson(jsDocTag.text);
        }
        else {
            return undefined;
        }
    };
    DefaultAnnotationsReader.prototype.parseJson = function (value) {
        try {
            return JSON.parse(value);
        }
        catch (e) {
            return undefined;
        }
    };
    return DefaultAnnotationsReader;
}());
DefaultAnnotationsReader.textTags = [
    "title",
    "description",
    "format",
    "pattern",
];
DefaultAnnotationsReader.jsonTags = [
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
    "default",
];
exports.DefaultAnnotationsReader = DefaultAnnotationsReader;
//# sourceMappingURL=DefaultAnnotationsReader.js.map