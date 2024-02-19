"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractLiterals = void 0;
const UnknownTypeError_1 = require("../Error/UnknownTypeError");
const AliasType_1 = require("../Type/AliasType");
const BooleanType_1 = require("../Type/BooleanType");
const DefinitionType_1 = require("../Type/DefinitionType");
const EnumType_1 = require("../Type/EnumType");
const LiteralType_1 = require("../Type/LiteralType");
const UnionType_1 = require("../Type/UnionType");
function* _extractLiterals(type) {
    if (!type) {
        return;
    }
    if (type instanceof LiteralType_1.LiteralType) {
        yield type.getValue().toString();
        return;
    }
    if (type instanceof UnionType_1.UnionType || type instanceof EnumType_1.EnumType) {
        for (const t of type.getTypes()) {
            yield* _extractLiterals(t);
        }
        return;
    }
    if (type instanceof AliasType_1.AliasType || type instanceof DefinitionType_1.DefinitionType) {
        yield* _extractLiterals(type.getType());
        return;
    }
    if (type instanceof BooleanType_1.BooleanType) {
        yield* _extractLiterals(new UnionType_1.UnionType([new LiteralType_1.LiteralType("true"), new LiteralType_1.LiteralType("false")]));
        return;
    }
    throw new UnknownTypeError_1.UnknownTypeError(type);
}
function extractLiterals(type) {
    return [..._extractLiterals(type)];
}
exports.extractLiterals = extractLiterals;
//# sourceMappingURL=extractLiterals.js.map