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
var TupleType = (function (_super) {
    __extends(TupleType, _super);
    function TupleType(types) {
        var _this = _super.call(this) || this;
        _this.types = types;
        return _this;
    }
    TupleType.prototype.getId = function () {
        return "[" + this.types.map(function (item) { return item.getId(); }).join(",") + "]";
    };
    TupleType.prototype.getTypes = function () {
        return this.types;
    };
    return TupleType;
}(BaseType_1.BaseType));
exports.TupleType = TupleType;
//# sourceMappingURL=TupleType.js.map