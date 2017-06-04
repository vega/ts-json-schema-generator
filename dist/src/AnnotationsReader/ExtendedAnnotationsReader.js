"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var BasicAnnotationsReader_1 = require("./BasicAnnotationsReader");
var ExtendedAnnotationsReader = (function (_super) {
    __extends(ExtendedAnnotationsReader, _super);
    function ExtendedAnnotationsReader() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ExtendedAnnotationsReader.prototype.getAnnotations = function (node) {
        var annotations = __assign({}, this.getDescriptionAnnotation(node), this.getTypeAnnotation(node), _super.prototype.getAnnotations.call(this, node));
        return Object.keys(annotations).length ? annotations : undefined;
    };
    ExtendedAnnotationsReader.prototype.getDescriptionAnnotation = function (node) {
        var symbol = node.symbol;
        if (!symbol) {
            return undefined;
        }
        var comments = symbol.getDocumentationComment();
        if (!comments || !comments.length) {
            return undefined;
        }
        return { description: comments.map(function (comment) { return comment.text; }).join(" ") };
    };
    ExtendedAnnotationsReader.prototype.getTypeAnnotation = function (node) {
        var symbol = node.symbol;
        if (!symbol) {
            return undefined;
        }
        var jsDocTags = symbol.getJsDocTags();
        if (!jsDocTags || !jsDocTags.length) {
            return undefined;
        }
        var jsDocTag = jsDocTags.find(function (tag) { return tag.name === "asType" || tag.name === "TJS-type"; });
        if (!jsDocTag || !jsDocTag.text) {
            return undefined;
        }
        return { type: jsDocTag.text };
    };
    ExtendedAnnotationsReader.prototype.isNullable = function (node) {
        var symbol = node.symbol;
        if (!symbol) {
            return false;
        }
        var jsDocTags = symbol.getJsDocTags();
        if (!jsDocTags || !jsDocTags.length) {
            return false;
        }
        var jsDocTag = jsDocTags.find(function (tag) { return tag.name === "nullable"; });
        return !!jsDocTag;
    };
    return ExtendedAnnotationsReader;
}(BasicAnnotationsReader_1.BasicAnnotationsReader));
exports.ExtendedAnnotationsReader = ExtendedAnnotationsReader;
//# sourceMappingURL=ExtendedAnnotationsReader.js.map