"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndexedAccessTypeNodeParser = void 0;
const tslib_1 = require("tslib");
const typescript_1 = tslib_1.__importDefault(require("typescript"));
const Errors_js_1 = require("../Error/Errors.js");
const LiteralType_js_1 = require("../Type/LiteralType.js");
const NeverType_js_1 = require("../Type/NeverType.js");
const NumberType_js_1 = require("../Type/NumberType.js");
const ReferenceType_js_1 = require("../Type/ReferenceType.js");
const StringType_js_1 = require("../Type/StringType.js");
const TupleType_js_1 = require("../Type/TupleType.js");
const UnionType_js_1 = require("../Type/UnionType.js");
const UnknownType_js_1 = require("../Type/UnknownType.js");
const derefType_js_1 = require("../Utils/derefType.js");
const typeKeys_js_1 = require("../Utils/typeKeys.js");
class IndexedAccessTypeNodeParser {
    typeChecker;
    childNodeParser;
    constructor(typeChecker, childNodeParser) {
        this.typeChecker = typeChecker;
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.IndexedAccessType;
    }
    createIndexedType(objectType, context, indexType) {
        if (typescript_1.default.isTypeReferenceNode(objectType) && indexType instanceof LiteralType_js_1.LiteralType) {
            const declaration = this.typeChecker.getSymbolAtLocation(objectType.typeName)?.declarations?.[0];
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
        const indexType = (0, derefType_js_1.derefType)(this.childNodeParser.createType(node.indexType, context));
        const indexedType = this.createIndexedType(node.objectType, context, indexType);
        if (indexedType && !(0, UnknownType_js_1.isErroredUnknownType)(indexedType)) {
            return indexedType;
        }
        const objectType = (0, derefType_js_1.derefType)(this.childNodeParser.createType(node.objectType, context));
        if (objectType instanceof NeverType_js_1.NeverType || indexType instanceof NeverType_js_1.NeverType) {
            return new NeverType_js_1.NeverType();
        }
        const indexTypes = indexType instanceof UnionType_js_1.UnionType ? indexType.getTypes() : [indexType];
        const propertyTypes = indexTypes.map((type) => {
            if (!(type instanceof LiteralType_js_1.LiteralType || type instanceof StringType_js_1.StringType || type instanceof NumberType_js_1.NumberType)) {
                throw new Errors_js_1.LogicError(node, `Unexpected type "${type.getId()}" (expected "LiteralType.js" or "StringType.js" or "NumberType.js")`);
            }
            const propertyType = (0, typeKeys_js_1.getTypeByKey)(objectType, type);
            if (!propertyType) {
                if (type instanceof NumberType_js_1.NumberType && objectType instanceof TupleType_js_1.TupleType) {
                    return new UnionType_js_1.UnionType(objectType.getTypes());
                }
                if (type instanceof LiteralType_js_1.LiteralType) {
                    if (objectType instanceof ReferenceType_js_1.ReferenceType) {
                        return objectType;
                    }
                    // When the indexed property does not exist (e.g. constrained generics with
                    // narrower instantiations), treat it as never so optional properties are dropped
                    // instead of throwing.
                    return new NeverType_js_1.NeverType();
                }
                throw new Errors_js_1.LogicError(node, `No additional properties in type "${objectType.getId()}"`);
            }
            return propertyType;
        });
        return propertyTypes.length === 1 ? propertyTypes[0] : new UnionType_js_1.UnionType(propertyTypes);
    }
}
exports.IndexedAccessTypeNodeParser = IndexedAccessTypeNodeParser;
//# sourceMappingURL=IndexedAccessTypeNodeParser.js.map