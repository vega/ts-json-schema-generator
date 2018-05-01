"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
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
    getParameters() {
        return this.parameters;
    }
    hasParameters() {
        return this.parameters.length > 0;
    }
    getReference() {
        return this.reference;
    }
    getParameterProperties(typeId, namesOnly = false, propertyType) {
        const t = this.arguments.find((v, i) => {
            return this.parameters[i] === typeId;
        });
        if (t.constructor.name === "DefinitionType") {
            if (namesOnly) {
                return t.getType().getProperties().map((p) => p.name);
            }
            else if (propertyType) {
                return t.getType().getProperties().map((p) => { p.setType(propertyType); return p; });
            }
            else {
                return t.getType().getProperties();
            }
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
        else if (t.constructor.name === "EnumType") {
            return (namesOnly) ?
                t.getValues()
                : t.getValues()
                    .map(val => new __1.ObjectProperty(val, this.arguments.find((v, i) => {
                    return this.parameters[i] !== typeId;
                }), false));
        }
        else {
            throw new Error(`type ${t.constructor.name} not handled`);
        }
    }
    ;
}
exports.Context = Context;
//# sourceMappingURL=NodeParser.js.map