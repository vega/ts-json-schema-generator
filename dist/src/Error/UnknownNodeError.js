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
Object.defineProperty(exports, "__esModule", { value: true });
var BaseError_1 = require("./BaseError");
var UnknownNodeError = (function (_super) {
    __extends(UnknownNodeError, _super);
    function UnknownNodeError(node, reference) {
        var _this = _super.call(this) || this;
        _this.node = node;
        _this.reference = reference;
        return _this;
    }
    Object.defineProperty(UnknownNodeError.prototype, "name", {
        get: function () {
            return "UnknownNodeError";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UnknownNodeError.prototype, "message", {
        get: function () {
            return "Unknown node \"" + this.node.getFullText();
        },
        enumerable: true,
        configurable: true
    });
    UnknownNodeError.prototype.getNode = function () {
        return this.node;
    };
    UnknownNodeError.prototype.getReference = function () {
        return this.reference;
    };
    return UnknownNodeError;
}(BaseError_1.BaseError));
exports.UnknownNodeError = UnknownNodeError;
//# sourceMappingURL=UnknownNodeError.js.map