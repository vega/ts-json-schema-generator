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
var ts = require("typescript");
var BaseError_1 = require("./BaseError");
var DiagnosticError = (function (_super) {
    __extends(DiagnosticError, _super);
    function DiagnosticError(diagnostics) {
        var _this = _super.call(this) || this;
        _this.diagnostics = diagnostics;
        return _this;
    }
    Object.defineProperty(DiagnosticError.prototype, "name", {
        get: function () {
            return "DiagnosticError";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DiagnosticError.prototype, "message", {
        get: function () {
            return this.diagnostics
                .map(function (diagnostic) { return ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"); })
                .join("\n\n");
        },
        enumerable: true,
        configurable: true
    });
    DiagnosticError.prototype.getDiagnostics = function () {
        return this.diagnostics;
    };
    return DiagnosticError;
}(BaseError_1.BaseError));
exports.DiagnosticError = DiagnosticError;
//# sourceMappingURL=DiagnosticError.js.map