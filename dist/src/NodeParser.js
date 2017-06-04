"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Context = (function () {
    function Context(reference) {
        this.arguments = [];
        this.parameters = [];
        this.reference = reference;
    }
    Context.prototype.pushArgument = function (argumentType) {
        this.arguments.push(argumentType);
    };
    Context.prototype.pushParameter = function (parameterName) {
        this.parameters.push(parameterName);
    };
    Context.prototype.getArgument = function (parameterName) {
        var index = this.parameters.indexOf(parameterName);
        if (index < 0 || !this.arguments[index]) {
            throw new Error("Could not find type parameter \"" + parameterName + "\"");
        }
        return this.arguments[index];
    };
    Context.prototype.getArguments = function () {
        return this.arguments;
    };
    Context.prototype.getReference = function () {
        return this.reference;
    };
    return Context;
}());
exports.Context = Context;
//# sourceMappingURL=NodeParser.js.map