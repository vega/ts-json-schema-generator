"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const AliasType_1 = require("./Type/AliasType");
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
    getParameterProperties(typeId, namesOnly = false) {
        const t = this.arguments.find((v, i) => {
            return this.parameters[i] === typeId;
        });
        let t_cpy = t;
        while (t_cpy.getType != undefined &&
            (t_cpy.getType() instanceof AliasType_1.AliasType)) {
            t_cpy = t_cpy.getType();
        }
        if (t_cpy.constructor.name === "DefinitionType") {
            let objectProps = [];
            let baseTypes = t_cpy.getType().getBaseTypes();
            if (baseTypes.length) {
                if (namesOnly) {
                    for (let i = 0; i < baseTypes.length; i++) {
                        objectProps.push(...baseTypes[i].getType().getProperties().map((p) => p.name));
                    }
                }
                else {
                    for (let i = 0; i < baseTypes.length; i++) {
                        objectProps.push(...baseTypes[i].getType().getProperties());
                    }
                }
            }
            if (namesOnly) {
                return objectProps.concat(t_cpy.getType().getProperties().map((p) => p.name));
            }
            else {
                return objectProps.concat(t_cpy.getType().getProperties());
            }
        }
        else if (t_cpy.constructor.name === "ObjectType") {
            return (namesOnly) ? t_cpy.getProperties().map((p) => p.name) : t_cpy.getProperties();
        }
        else if (t_cpy.constructor.name === "UnionType") {
            return t_cpy.getTypes().map((a) => a.value);
        }
        else if (t_cpy.constructor.name === "LiteralType") {
            return [t_cpy.getValue()];
        }
        else if (t_cpy.constructor.name === "EnumType") {
            return (namesOnly) ?
                t_cpy.getValues()
                : t_cpy.getValues()
                    .map(val => new __1.ObjectProperty(val, this.arguments.find((v, i) => {
                    return this.parameters[i] !== typeId;
                }), false));
        }
        else if (t_cpy.constructor.name === "AliasType") {
            if (namesOnly) {
                return t_cpy.getType().getProperties().map((p) => p.name);
            }
            else {
                return t_cpy.getType().getProperties();
            }
        }
        else {
            throw new Error(`type ${t_cpy.constructor.name} not handled`);
        }
    }
    ;
}
exports.Context = Context;
//# sourceMappingURL=NodeParser.js.map