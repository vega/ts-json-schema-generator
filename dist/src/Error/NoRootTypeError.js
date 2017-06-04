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
var NoRootTypeError = (function (_super) {
    __extends(NoRootTypeError, _super);
    function NoRootTypeError(type) {
        var _this = _super.call(this) || this;
        _this.type = type;
        return _this;
    }
    Object.defineProperty(NoRootTypeError.prototype, "name", {
        get: function () {
            return "NoRootTypeError";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NoRootTypeError.prototype, "message", {
        get: function () {
            return "No root type \"" + this.type + "\" found";
        },
        enumerable: true,
        configurable: true
    });
    NoRootTypeError.prototype.getType = function () {
        return this.type;
    };
    return NoRootTypeError;
}(BaseError_1.BaseError));
exports.NoRootTypeError = NoRootTypeError;
//# sourceMappingURL=NoRootTypeError.js.map