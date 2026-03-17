"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractLiterals = extractLiterals;
const Errors_js_1 = require("../Error/Errors.js");
const AliasType_js_1 = require("../Type/AliasType.js");
const BooleanType_js_1 = require("../Type/BooleanType.js");
const DefinitionType_js_1 = require("../Type/DefinitionType.js");
const EnumType_js_1 = require("../Type/EnumType.js");
const LiteralType_js_1 = require("../Type/LiteralType.js");
const UnionType_js_1 = require("../Type/UnionType.js");
const derefType_js_1 = require("./derefType.js");
function* _extractLiterals(type) {
    if (!type) {
        return;
    }
    const dereffedType = (0, derefType_js_1.derefAnnotatedType)(type);
    if (dereffedType instanceof LiteralType_js_1.LiteralType) {
        yield dereffedType.getValue().toString();
        return;
    }
    if (dereffedType instanceof UnionType_js_1.UnionType || dereffedType instanceof EnumType_js_1.EnumType) {
        for (const t of dereffedType.getTypes()) {
            yield* _extractLiterals(t);
        }
        return;
    }
    if (dereffedType instanceof AliasType_js_1.AliasType || dereffedType instanceof DefinitionType_js_1.DefinitionType) {
        yield* _extractLiterals(dereffedType.getType());
        return;
    }
    if (dereffedType instanceof BooleanType_js_1.BooleanType) {
        yield* _extractLiterals(new UnionType_js_1.UnionType([new LiteralType_js_1.LiteralType("true"), new LiteralType_js_1.LiteralType("false")]));
        return;
    }
    throw new Errors_js_1.UnknownTypeError(dereffedType);
}
function extractLiterals(type) {
    return [..._extractLiterals(type)];
}
//# sourceMappingURL=extractLiterals.js.map