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
    hasParameters() {
        return this.parameters.length > 0;
    }
    getReference() {
        return this.reference;
    }
    getParameterProperties(typeId, namesOnly = false) {
        const t = this.arguments.find((v, i) => {
            return this.parameters[i] === typeId;
        });
        if (t.constructor.name === "DefinitionType") {
            return (namesOnly) ? t.getType().getProperties().map((p) => p.name) : t.getType().getProperties();
        }
        else if (t.constructor.name === "ObjectType") {
            return (namesOnly) ? t.getProperties().map((p) => p.name) : t.getProperties();
        }
        else if (t.constructor.name === "UnionType") {
            return t.getTypes().map((a) => a.value);
        }
        else if (t.constructor.name === "LiteralType") {
            return [t.getValue()];
        }
        else {
            throw new Error(`type ${t.constructor.name} not handled`);
        }
    }
    ;
}
exports.Context = Context;
//# sourceMappingURL=NodeParser.js.map