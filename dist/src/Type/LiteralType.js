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
var BaseType_1 = require("./BaseType");
var LiteralType = (function (_super) {
    __extends(LiteralType, _super);
    function LiteralType(value) {
        var _this = _super.call(this) || this;
        _this.value = value;
        return _this;
    }
    LiteralType.prototype.getId = function () {
        return JSON.stringify(this.value);
    };
    LiteralType.prototype.getValue = function () {
        return this.value;
    };
    return LiteralType;
}(BaseType_1.BaseType));
exports.LiteralType = LiteralType;
//# sourceMappingURL=LiteralType.js.map