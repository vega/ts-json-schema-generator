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
var PrimitiveType_1 = require("./PrimitiveType");
var NumberType = (function (_super) {
    __extends(NumberType, _super);
    function NumberType() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NumberType.prototype.getId = function () {
        return "number";
    };
    return NumberType;
}(PrimitiveType_1.PrimitiveType));
exports.NumberType = NumberType;
//# sourceMappingURL=NumberType.js.map