"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndexedAccessTypeNodeParser = void 0;
const typescript_1 = __importDefault(require("typescript"));
const LogicError_1 = require("../Error/LogicError");
const LiteralType_1 = require("../Type/LiteralType");
const NeverType_1 = require("../Type/NeverType");
const NumberType_1 = require("../Type/NumberType");
const ReferenceType_1 = require("../Type/ReferenceType");
const StringType_1 = require("../Type/StringType");
const TupleType_1 = require("../Type/TupleType");
const UnionType_1 = require("../Type/UnionType");
const derefType_1 = require("../Utils/derefType");
const typeKeys_1 = require("../Utils/typeKeys");
class IndexedAccessTypeNodeParser {
    constructor(typeChecker, childNodeParser) {
        this.typeChecker = typeChecker;
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.IndexedAccessType;
    }
    createIndexedType(objectType, context, indexType) {
        var _a, _b;
        if (typescript_1.default.isTypeReferenceNode(objectType) && indexType instanceof LiteralType_1.LiteralType) {
            const declaration = (_b = (_a = this.typeChecker.getSymbolAtLocation(objectType.typeName)) === null || _a === void 0 ? void 0 : _a.declarations) === null || _b === void 0 ? void 0 : _b[0];
            if (!declaration || !typescript_1.default.isTypeAliasDeclaration(declaration) || !typescript_1.default.isTypeLiteralNode(declaration.type)) {
                return undefined;
            }
            const member = declaration.type.members.find((m) => typescript_1.default.isPropertySignature(m) &&
                Boolean(m.type) &&
                typescript_1.default.isIdentifier(m.name) &&
                m.name.text === indexType.getValue());
            return member && this.childNodeParser.createType(member.type, context);
        }
        return undefined;
    }
    createType(node, context) {
        const indexType = (0, derefType_1.derefType)(this.childNodeParser.createType(node.indexType, context));
        const indexedType = this.createIndexedType(node.objectType, context, indexType);
        if (indexedType) {
            return indexedType;
        }
        const objectType = (0, derefType_1.derefType)(this.childNodeParser.createType(node.objectType, context));
        if (objectType instanceof NeverType_1.NeverType || indexType instanceof NeverType_1.NeverType) {
            return new NeverType_1.NeverType();
        }
        const indexTypes = indexType instanceof UnionType_1.UnionType ? indexType.getTypes() : [indexType];
        const propertyTypes = indexTypes.map((type) => {
            if (!(type instanceof LiteralType_1.LiteralType || type instanceof StringType_1.StringType || type instanceof NumberType_1.NumberType)) {
                throw new LogicError_1.LogicError(`Unexpected type "${type.getId()}" (expected "LiteralType" or "StringType" or "NumberType")`);
            }
            const propertyType = (0, typeKeys_1.getTypeByKey)(objectType, type);
            if (!propertyType) {
                if (type instanceof NumberType_1.NumberType && objectType instanceof TupleType_1.TupleType) {
                    return new UnionType_1.UnionType(objectType.getTypes());
                }
                else if (type instanceof LiteralType_1.LiteralType) {
                    if (objectType instanceof ReferenceType_1.ReferenceType) {
                        return objectType;
                    }
                    throw new LogicError_1.LogicError(`Invalid index "${type.getValue()}" in type "${objectType.getId()}"`);
                }
                else {
                    throw new LogicError_1.LogicError(`No additional properties in type "${objectType.getId()}"`);
                }
            }
            return propertyType;
        });
        return propertyTypes.length === 1 ? propertyTypes[0] : new UnionType_1.UnionType(propertyTypes);
    }
}
exports.IndexedAccessTypeNodeParser = IndexedAccessTypeNodeParser;
//# sourceMappingURL=IndexedAccessTypeNodeParser.js.map