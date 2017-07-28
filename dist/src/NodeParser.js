"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Context {
    constructor(reference) {
        this.arguments = [];
        this.parameters = [];
        this.reference = reference;
    }
    pushArgument(argumentType) {
        this.arguments.push(argumentType);
    }
    pushParameter(parameterName) {
        this.parameters.push(parameterName);
    }
    getArgument(parameterName) {
        const index = this.parameters.indexOf(parameterName);
        if (index < 0 || !this.arguments[index]) {
            throw new Error(`Could not find type parameter "${parameterName}"`);
        }
        return this.arguments[index];
    }
    getArguments() {
        return this.arguments;
    }
    getReference() {
        return this.reference;
    }
}
exports.Context = Context;
//# sourceMappingURL=NodeParser.js.map