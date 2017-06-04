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
var TypeofType = (function (_super) {
    __extends(TypeofType, _super);
    function TypeofType(id, expression) {
        var _this = _super.call(this) || this;
        _this.id = id;
        _this.expression = expression;
        return _this;
    }
    TypeofType.prototype.getId = function () {
        return this.id;
    };
    return TypeofType;
}(BaseType_1.BaseType));
exports.TypeofType = TypeofType;
//# sourceMappingURL=TypeofType.js.map