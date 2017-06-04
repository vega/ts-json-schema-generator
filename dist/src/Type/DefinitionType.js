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
var DefinitionType = (function (_super) {
    __extends(DefinitionType, _super);
    function DefinitionType(name, type) {
        var _this = _super.call(this) || this;
        _this.name = name;
        _this.type = type;
        return _this;
    }
    DefinitionType.prototype.getId = function () {
        return this.name;
    };
    DefinitionType.prototype.getType = function () {
        return this.type;
    };
    return DefinitionType;
}(BaseType_1.BaseType));
exports.DefinitionType = DefinitionType;
//# sourceMappingURL=DefinitionType.js.map