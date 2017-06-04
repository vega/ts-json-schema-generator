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
var ReferenceType = (function (_super) {
    __extends(ReferenceType, _super);
    function ReferenceType() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ReferenceType.prototype.getId = function () {
        return this.type.getId();
    };
    ReferenceType.prototype.getType = function () {
        return this.type;
    };
    ReferenceType.prototype.setType = function (type) {
        this.type = type;
    };
    return ReferenceType;
}(BaseType_1.BaseType));
exports.ReferenceType = ReferenceType;
//# sourceMappingURL=ReferenceType.js.map