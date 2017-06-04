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
var UnknownTypeError = (function (_super) {
    __extends(UnknownTypeError, _super);
    function UnknownTypeError(type) {
        var _this = _super.call(this) || this;
        _this.type = type;
        return _this;
    }
    Object.defineProperty(UnknownTypeError.prototype, "name", {
        get: function () {
            return "UnknownTypeError";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UnknownTypeError.prototype, "message", {
        get: function () {
            return "Unknown type \"" + this.type.getId() + "\"";
        },
        enumerable: true,
        configurable: true
    });
    UnknownTypeError.prototype.getType = function () {
        return this.type;
    };
    return UnknownTypeError;
}(BaseError_1.BaseError));
exports.UnknownTypeError = UnknownTypeError;
//# sourceMappingURL=UnknownTypeError.js.map