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
var BooleanType = (function (_super) {
    __extends(BooleanType, _super);
    function BooleanType() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BooleanType.prototype.getId = function () {
        return "boolean";
    };
    return BooleanType;
}(PrimitiveType_1.PrimitiveType));
exports.BooleanType = BooleanType;
//# sourceMappingURL=BooleanType.js.map