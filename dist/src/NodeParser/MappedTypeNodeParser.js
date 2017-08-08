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
        const type = this.typeChecker.getTypeFromTypeNode(node.typeParameter.constraint);
        return type.types
            .reduce((result, t) => {
            const objectProperty = new ObjectType_1.ObjectProperty(t.value, this.childNodeParser.createType(node.type, context), !node.questionToken);
            result.push(objectProperty);
            return result;
        }, []);
    }
}
exports.MappedTypeNodeParser = MappedTypeNodeParser;
//# sourceMappingURL=MappedTypeNodeParser.js.map