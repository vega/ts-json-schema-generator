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
var EnumType = (function (_super) {
    __extends(EnumType, _super);
    function EnumType(id, values) {
        var _this = _super.call(this) || this;
        _this.id = id;
        _this.values = values;
        return _this;
    }
    EnumType.prototype.getId = function () {
        return this.id;
    };
    EnumType.prototype.getValues = function () {
        return this.values;
    };
    return EnumType;
}(BaseType_1.BaseType));
exports.EnumType = EnumType;
//# sourceMappingURL=EnumType.js.map