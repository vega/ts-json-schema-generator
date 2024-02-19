"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Context = void 0;
const safe_stable_stringify_1 = __importDefault(require("safe-stable-stringify"));
const nodeKey_1 = require("./Utils/nodeKey");
class Context {
    constructor(reference) {
        this.cacheKey = null;
        this.arguments = [];
        this.parameters = [];
        this.defaultArgument = new Map();
        this.reference = reference;
    }
    pushArgument(argumentType) {
        this.arguments.push(argumentType);
        this.cacheKey = null;
    }
    pushParameter(parameterName) {
        this.parameters.push(parameterName);
    }
    setDefault(parameterName, argumentType) {
        this.defaultArgument.set(parameterName, argumentType);
    }
    getCacheKey() {
        if (this.cacheKey == null) {
            this.cacheKey = (0, safe_stable_stringify_1.default)([
                this.reference ? (0, nodeKey_1.getKey)(this.reference, this) : "",
                this.arguments.map((argument) => argument === null || argument === void 0 ? void 0 : argument.getId()),
            ]);
        }
        return this.cacheKey;
    }
    getArgument(parameterName) {
        const index = this.parameters.indexOf(parameterName);
        if ((index < 0 || !this.arguments[index]) && this.defaultArgument.has(parameterName)) {
            return this.defaultArgument.get(parameterName);
        }
        return this.arguments[index];
    }
    getParameters() {
        return this.parameters;
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