"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const ObjectType_1 = require("../Type/ObjectType");
class MappedTypeNodeParser {
    constructor(typeChecker, childNodeParser) {
        this.typeChecker = typeChecker;
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        return node.kind === ts.SyntaxKind.MappedType;
    }
    createType(node, context) {
        return new ObjectType_1.ObjectType(`indexed-type-${node.getFullStart()}`, [], this.getProperties(node, context), false);
    }
    getProperties(node, context) {
        const getParameterProperties = function (typeId, namesOnly = false) {
            const t = context.getArguments().find((v, i) => {
                return context.parameters[i] === typeId;
            });
            if (t.constructor.name === "DefinitionType") {
                return t.getType().getProperties();
            }
            else if (t.constructor.name === "ObjectType") {
                return (namesOnly) ? t.getProperties().map((p) => p.name) :
                    t.getProperties();
            }
            else if (t.constructor.name === "UnionType") {
                return t.types.map((a) => a.value);
            }
            else if (t.constructor.name === "LiteralType") {
                return t.getValue();
            }
            else {
                return [];
            }
        };
        if (context.parameters.length > 0) {
            const originalProps = (node.type && node.type.objectType) ?
                getParameterProperties(node.type.objectType.typeName.text) : [];
            const toPick = (node.typeParameter && node.typeParameter.constraint &&
                node.typeParameter.constraint.typeName) ?
                getParameterProperties(node.typeParameter.constraint.typeName.text, true) :
                (node.typeParameter && node.typeParameter.constraint &&
                    node.typeParameter.constraint.type && node.typeParameter.constraint.type.typeName) ?
                    getParameterProperties(node.typeParameter.constraint.type.typeName.text, true) :
                    [];
            return originalProps.filter((p) => {
                return toPick.includes(p.name);
            }).map((p) => {
                p.required = !node.questionToken;
                return p;
            });
        }
        else {
            const type = this.typeChecker.getTypeFromTypeNode(node.typeParameter.constraint);
            if (type.types) {
                return type.types.reduce((result, t) => {
                    const createdType = this.childNodeParser.createType(node.type, context);
                    const objectProperty = new ObjectType_1.ObjectProperty(t.value, createdType, !node.questionToken);
                    result.push(objectProperty);
                    return result;
                }, []);
            }
        }
        return [];
    }
}
exports.MappedTypeNodeParser = MappedTypeNodeParser;
//# sourceMappingURL=MappedTypeNodeParser.js.map