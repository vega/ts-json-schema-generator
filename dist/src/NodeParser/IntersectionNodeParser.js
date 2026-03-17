"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntersectionNodeParser = void 0;
exports.translate = translate;
const tslib_1 = require("tslib");
const typescript_1 = tslib_1.__importDefault(require("typescript"));
const Errors_js_1 = require("../Error/Errors.js");
const IntersectionType_js_1 = require("../Type/IntersectionType.js");
const LiteralType_js_1 = require("../Type/LiteralType.js");
const NeverType_js_1 = require("../Type/NeverType.js");
const ObjectType_js_1 = require("../Type/ObjectType.js");
const PrimitiveType_js_1 = require("../Type/PrimitiveType.js");
const StringType_js_1 = require("../Type/StringType.js");
const UndefinedType_js_1 = require("../Type/UndefinedType.js");
const UnionType_js_1 = require("../Type/UnionType.js");
const LiteralUnionTypeFormatter_js_1 = require("../TypeFormatter/LiteralUnionTypeFormatter.js");
const derefType_js_1 = require("../Utils/derefType.js");
const uniqueTypeArray_js_1 = require("../Utils/uniqueTypeArray.js");
class IntersectionNodeParser {
    typeChecker;
    childNodeParser;
    constructor(typeChecker, childNodeParser) {
        this.typeChecker = typeChecker;
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.IntersectionType;
    }
    createType(node, context) {
        const types = node.types.map((subnode) => this.childNodeParser.createType(subnode, context));
        // if any type is never, the intersection type resolves to never
        if (types.filter((t) => t instanceof NeverType_js_1.NeverType).length) {
            return new NeverType_js_1.NeverType();
        }
        // handle autocomplete hacks like `string & {}`
        if (types.length === 2 && types.some((t) => isEmptyObject(t))) {
            if (types.some((t) => t instanceof StringType_js_1.StringType)) {
                return new StringType_js_1.StringType(true);
            }
            const nonObject = types.find((t) => !isEmptyObject(t));
            if (nonObject instanceof LiteralType_js_1.LiteralType || (nonObject instanceof UnionType_js_1.UnionType && (0, LiteralUnionTypeFormatter_js_1.isLiteralUnion)(nonObject))) {
                return nonObject;
            }
        }
        return translate(types);
    }
}
exports.IntersectionNodeParser = IntersectionNodeParser;
function isEmptyObject(x) {
    const t = (0, derefType_js_1.derefType)(x);
    return t instanceof ObjectType_js_1.ObjectType && !t.getAdditionalProperties() && !t.getProperties().length;
}
function derefAndFlattenUnions(type) {
    const derefed = (0, derefType_js_1.derefType)(type);
    return derefed instanceof UnionType_js_1.UnionType
        ? derefed.getTypes().reduce((result, derefedType) => {
            result.push(...derefAndFlattenUnions(derefedType));
            return result;
        }, [])
        : [type];
}
/**
 * Translates the given intersection type into a union type if necessary so `A & (B | C)` becomes
 * `(A & B) | (A & C)`. If no translation is needed then the original intersection type is returned.
 */
function translate(types) {
    types = (0, uniqueTypeArray_js_1.uniqueTypeArray)(types);
    if (types.length === 1) {
        return types[0];
    }
    const unions = types.map(derefAndFlattenUnions);
    const result = [];
    function process(i, t = []) {
        for (const type of unions[i]) {
            let currentTypes = [...t, type];
            if (i < unions.length - 1) {
                process(i + 1, currentTypes);
            }
            else {
                currentTypes = (0, uniqueTypeArray_js_1.uniqueTypeArray)(currentTypes);
                if (currentTypes.some((c) => c instanceof UndefinedType_js_1.UndefinedType)) {
                    // never
                    result.push(new UndefinedType_js_1.UndefinedType());
                }
                else {
                    const primitives = currentTypes.filter((c) => c instanceof PrimitiveType_js_1.PrimitiveType);
                    if (primitives.length === 1) {
                        result.push(primitives[0]);
                    }
                    else if (primitives.length > 1) {
                        // conflict -> ignore
                    }
                    else if (currentTypes.length === 1) {
                        result.push(currentTypes[0]);
                    }
                    else {
                        result.push(new IntersectionType_js_1.IntersectionType(currentTypes));
                    }
                }
            }
        }
    }
    process(0);
    if (result.length === 1) {
        return result[0];
    }
    if (result.length > 1) {
        return new UnionType_js_1.UnionType(result);
    }
    throw new Errors_js_1.ExpectationFailedError("Could not translate intersection to union.");
}
//# sourceMappingURL=IntersectionNodeParser.js.map