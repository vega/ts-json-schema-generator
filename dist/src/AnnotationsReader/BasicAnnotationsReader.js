"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BasicAnnotationsReader = (function () {
    function BasicAnnotationsReader() {
    }
    BasicAnnotationsReader.prototype.getAnnotations = function (node) {
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
    BasicAnnotationsReader.prototype.parseJsDocTag = function (jsDocTag) {
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
    };
    BasicAnnotationsReader.prototype.parseJson = function (value) {
        try {
            return JSON.parse(value);
        }
        catch (e) {
            return undefined;
        }
    };
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
        "default",
    ];
    return BasicAnnotationsReader;
}());
exports.BasicAnnotationsReader = BasicAnnotationsReader;
//# sourceMappingURL=BasicAnnotationsReader.js.map