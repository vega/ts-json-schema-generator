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
var LogicError = (function (_super) {
    __extends(LogicError, _super);
    function LogicError(msg) {
        var _this = _super.call(this) || this;
        _this.msg = msg;
        return _this;
    }
    Object.defineProperty(LogicError.prototype, "name", {
        get: function () {
            return "LogicError";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LogicError.prototype, "message", {
        get: function () {
            return this.msg;
        },
        enumerable: true,
        configurable: true
    });
    return LogicError;
}(BaseError_1.BaseError));
exports.LogicError = LogicError;
//# sourceMappingURL=LogicError.js.map