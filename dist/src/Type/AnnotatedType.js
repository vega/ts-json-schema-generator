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
var AnnotatedType = (function (_super) {
    __extends(AnnotatedType, _super);
    function AnnotatedType(type, annotations, nullable) {
        var _this = _super.call(this) || this;
        _this.type = type;
        _this.annotations = annotations;
        _this.nullable = nullable;
        return _this;
    }
    AnnotatedType.prototype.getId = function () {
        return this.type.getId();
    };
    AnnotatedType.prototype.getType = function () {
        return this.type;
    };
    AnnotatedType.prototype.getAnnotations = function () {
        return this.annotations;
    };
    AnnotatedType.prototype.isNullable = function () {
        return this.nullable;
    };
    return AnnotatedType;
}(BaseType_1.BaseType));
exports.AnnotatedType = AnnotatedType;
//# sourceMappingURL=AnnotatedType.js.map