"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.derefType = derefType;
exports.derefAnnotatedType = derefAnnotatedType;
exports.isHiddenType = isHiddenType;
exports.isDeepLiteralUnion = isDeepLiteralUnion;
exports.derefAliasedType = derefAliasedType;
const AliasType_js_1 = require("../Type/AliasType.js");
const AnnotatedType_js_1 = require("../Type/AnnotatedType.js");
const DefinitionType_js_1 = require("../Type/DefinitionType.js");
const HiddenType_js_1 = require("../Type/HiddenType.js");
const LiteralType_js_1 = require("../Type/LiteralType.js");
const NeverType_js_1 = require("../Type/NeverType.js");
const ReferenceType_js_1 = require("../Type/ReferenceType.js");
const UnionType_js_1 = require("../Type/UnionType.js");
/**
 * Dereference the type as far as possible.
 */
function derefType(type) {
    if (type instanceof DefinitionType_js_1.DefinitionType || type instanceof AliasType_js_1.AliasType || type instanceof AnnotatedType_js_1.AnnotatedType) {
        return derefType(type.getType());
    }
    if (type instanceof ReferenceType_js_1.ReferenceType && type.hasType()) {
        return derefType(type.getType());
    }
    return type;
}
function derefAnnotatedType(type) {
    if (type instanceof AnnotatedType_js_1.AnnotatedType || type instanceof AliasType_js_1.AliasType) {
        return derefAnnotatedType(type.getType());
    }
    return type;
}
function isHiddenType(type) {
    if (type instanceof HiddenType_js_1.HiddenType || type instanceof NeverType_js_1.NeverType) {
        return true;
    }
    else if (type instanceof DefinitionType_js_1.DefinitionType || type instanceof AliasType_js_1.AliasType || type instanceof AnnotatedType_js_1.AnnotatedType) {
        return isHiddenType(type.getType());
    }
    return false;
}
/**
 * Recursively checks whether the given type is a union composed entirely of literal types.
 */
function isDeepLiteralUnion(type) {
    const resolved = derefType(type);
    if (resolved instanceof LiteralType_js_1.LiteralType) {
        return true;
    }
    if (resolved instanceof UnionType_js_1.UnionType) {
        return resolved.getTypes().every((t) => isDeepLiteralUnion(t));
    }
    return false;
}
function derefAliasedType(type) {
    if (type instanceof AliasType_js_1.AliasType) {
        return derefAliasedType(type.getType());
    }
    return type;
}
//# sourceMappingURL=derefType.js.map