"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const NodeParser_1 = require("../NodeParser");
const EnumType_1 = require("../Type/EnumType");
const UnionType_1 = require("../Type/UnionType");
class IndexedAccessTypeNodeParser {
    constructor(typeChecker, childNodeParser) {
        this.typeChecker = typeChecker;
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        return node.kind === ts.SyntaxKind.IndexedAccessType;
    }
    createType(node, context) {
        if (node.indexType && node.indexType.type && node.objectType && node.objectType.type) {
            let keys = this.childNodeParser.createType(node.indexType, context);
            let mappedType = this.childNodeParser.createType(node.objectType, context);
            return new UnionType_1.UnionType(keys.getTypes().map((litType) => {
                let objProp = mappedType.properties.find((objProp) => {
                    if (objProp.getName() == litType.getValue()) {
                        return true;
                    }
                    return false;
                });
                return objProp.type.type;
            }));
        }
        if (node.indexType && node.indexType.type && node.indexType.type.typeName &&
            node.indexType.type.typeName.text &&
            node.objectType && node.objectType.typeName &&
            node.objectType.typeName.text === node.indexType.type.typeName.text) {
            return this.childNodeParser.createType(context.getArguments()[0], context);
        }
        else if (node.objectType && node.objectType.type
            && node.indexType && node.indexType.type
            && node.indexType.type.typeName
            && node.indexType.type.typeName.text) {
            let argument = context.getArguments()[0];
            return new EnumType_1.EnumType(`indexed-type-${node.getFullStart()}`, argument.type.properties.map((property) => {
                let context = new NodeParser_1.Context();
                context.pushArgument(property.getType());
                return this.childNodeParser.createType(node.objectType, context);
            }));
        }
        else if (node.objectType.exprName) {
            const symbol = this.typeChecker.getSymbolAtLocation(node.objectType.exprName);
            return new EnumType_1.EnumType(`indexed-type-${node.getFullStart()}`, symbol.valueDeclaration.type.elementTypes.map((memberType) => this.childNodeParser.createType(memberType, context)));
        }
    }
}
exports.IndexedAccessTypeNodeParser = IndexedAccessTypeNodeParser;
//# sourceMappingURL=IndexedAccessTypeNodeParser.js.map