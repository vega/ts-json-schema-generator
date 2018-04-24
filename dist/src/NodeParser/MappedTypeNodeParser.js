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
        if (context.hasParameters()) {
            const originalProps = (node.type && node.type.objectType) ?
                context.getParameterProperties(node.type.objectType.typeName.text) : [];
            const toPick = (node.typeParameter && node.typeParameter.constraint &&
                node.typeParameter.constraint.typeName) ?
                context.getParameterProperties(node.typeParameter.constraint.typeName.text, true) :
                (node.typeParameter && node.typeParameter.constraint &&
                    node.typeParameter.constraint.type && node.typeParameter.constraint.type.typeName) ?
                    context.getParameterProperties(node.typeParameter.constraint.type.typeName.text, true) :
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