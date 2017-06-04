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
var UnionType = (function (_super) {
    __extends(UnionType, _super);
    function UnionType(types) {
        var _this = _super.call(this) || this;
        _this.types = types;
        return _this;
    }
    UnionType.prototype.getId = function () {
        return "(" + this.types.map(function (type) { return type.getId(); }).join("|") + ")";
    };
    UnionType.prototype.getTypes = function () {
        return this.types;
    };
    return UnionType;
}(BaseType_1.BaseType));
exports.UnionType = UnionType;
//# sourceMappingURL=UnionType.js.map