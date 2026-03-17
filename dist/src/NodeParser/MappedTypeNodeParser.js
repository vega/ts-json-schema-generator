"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MappedTypeNodeParser = void 0;
const tslib_1 = require("tslib");
const typescript_1 = tslib_1.__importDefault(require("typescript"));
const Errors_js_1 = require("../Error/Errors.js");
const NodeParser_js_1 = require("../NodeParser.js");
const AnnotatedType_js_1 = require("../Type/AnnotatedType.js");
const AnyType_js_1 = require("../Type/AnyType.js");
const ArrayType_js_1 = require("../Type/ArrayType.js");
const DefinitionType_js_1 = require("../Type/DefinitionType.js");
const EnumType_js_1 = require("../Type/EnumType.js");
const LiteralType_js_1 = require("../Type/LiteralType.js");
const NeverType_js_1 = require("../Type/NeverType.js");
const NumberType_js_1 = require("../Type/NumberType.js");
const ObjectType_js_1 = require("../Type/ObjectType.js");
const StringType_js_1 = require("../Type/StringType.js");
const SymbolType_js_1 = require("../Type/SymbolType.js");
const UnionType_js_1 = require("../Type/UnionType.js");
const derefType_js_1 = require("../Utils/derefType.js");
const nodeKey_js_1 = require("../Utils/nodeKey.js");
const preserveAnnotation_js_1 = require("../Utils/preserveAnnotation.js");
const removeUndefined_js_1 = require("../Utils/removeUndefined.js");
const uniqueTypeArray_js_1 = require("../Utils/uniqueTypeArray.js");
class MappedTypeNodeParser {
    childNodeParser;
    additionalProperties;
    constructor(childNodeParser, additionalProperties) {
        this.childNodeParser = childNodeParser;
        this.additionalProperties = additionalProperties;
    }
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.MappedType;
    }
    createType(node, context) {
        const constraintType = this.childNodeParser.createType(node.typeParameter.constraint, context);
        const keyListType = (0, derefType_js_1.derefType)(constraintType);
        const id = `indexed-type-${(0, nodeKey_js_1.getKey)(node, context)}`;
        if (keyListType instanceof UnionType_js_1.UnionType) {
            // Key type resolves to a set of known properties
            return new ObjectType_js_1.ObjectType(id, [], this.getProperties(node, keyListType, context), this.getAdditionalProperties(node, keyListType, context));
        }
        if (keyListType instanceof LiteralType_js_1.LiteralType) {
            // Key type resolves to single known property
            return new ObjectType_js_1.ObjectType(id, [], this.getProperties(node, new UnionType_js_1.UnionType([keyListType]), context), false);
        }
        const maybeUnionType = this.childNodeParser.createType(node.type, this.createSubContext(node, keyListType, context));
        if (maybeUnionType instanceof UnionType_js_1.UnionType && constraintType?.getId() === "number") {
            // Then we turn it into an array
            return maybeUnionType instanceof NeverType_js_1.NeverType ? new NeverType_js_1.NeverType() : new ArrayType_js_1.ArrayType(maybeUnionType);
        }
        if (keyListType instanceof StringType_js_1.StringType ||
            keyListType instanceof NumberType_js_1.NumberType ||
            keyListType instanceof SymbolType_js_1.SymbolType ||
            keyListType instanceof AnyType_js_1.AnyType) {
            // Key type widens to `string`
            const type = this.childNodeParser.createType(node.type, this.createSubContext(node, keyListType, context));
            // const resultType = type instanceof NeverType ? new NeverType() : new ObjectType(id, [], [], type);
            const resultType = new ObjectType_js_1.ObjectType(id, [], [], type);
            if (resultType) {
                let annotations;
                if (constraintType instanceof AnnotatedType_js_1.AnnotatedType) {
                    annotations = constraintType.getAnnotations();
                }
                else if (constraintType instanceof DefinitionType_js_1.DefinitionType) {
                    const childType = constraintType.getType();
                    if (childType instanceof AnnotatedType_js_1.AnnotatedType) {
                        annotations = childType.getAnnotations();
                    }
                }
                if (annotations) {
                    return new AnnotatedType_js_1.AnnotatedType(resultType, { propertyNames: annotations }, false);
                }
            }
            return resultType;
        }
        if (keyListType instanceof EnumType_js_1.EnumType) {
            return new ObjectType_js_1.ObjectType(id, [], this.getValues(node, keyListType, context), false);
        }
        if (keyListType instanceof NeverType_js_1.NeverType) {
            return new ObjectType_js_1.ObjectType(id, [], [], false);
        }
        throw new Errors_js_1.ExpectationFailedError(`Unexpected key type "${constraintType ? constraintType.getId() : constraintType}" for this node. (expected "UnionType" or "StringType")`, node);
    }
    /**
     * In mapped types, questionToken can be:
     * - undefined: no optional modifier
     * - QuestionToken (?): add optional
     * - PlusToken (+?): add optional
     * - MinusToken (-?): remove optional (e.g. Required<T>) → property is required
     */
    isMappedPropertyRequired(node, hasUndefinedInType) {
        if (node.questionToken === undefined) {
            return !hasUndefinedInType;
        }
        if (node.questionToken.kind === typescript_1.default.SyntaxKind.MinusToken) {
            return true; // -? removes optional → output property is always required
        }
        return false;
    }
    mapKey(node, rawKey, context) {
        if (!node.nameType) {
            return rawKey;
        }
        return (0, derefType_js_1.derefType)(this.childNodeParser.createType(node.nameType, this.createSubContext(node, rawKey, context)));
    }
    getProperties(node, keyListType, context) {
        return (0, uniqueTypeArray_js_1.uniqueTypeArray)(keyListType.getFlattenedTypes(derefType_js_1.derefType))
            .filter((type) => type instanceof LiteralType_js_1.LiteralType)
            .map((type) => [type, this.mapKey(node, type, context)])
            .filter((value) => value[1] instanceof LiteralType_js_1.LiteralType)
            .reduce((result, [key, mappedKey]) => {
            const propertyType = this.childNodeParser.createType(node.type, this.createSubContext(node, key, context));
            let newType = (0, derefType_js_1.derefAnnotatedType)(propertyType);
            let hasUndefined = false;
            if (newType instanceof UnionType_js_1.UnionType) {
                const { newType: newType_, numRemoved } = (0, removeUndefined_js_1.removeUndefined)(newType);
                hasUndefined = numRemoved > 0;
                newType = newType_;
            }
            const objectProperty = new ObjectType_js_1.ObjectProperty(mappedKey.getValue().toString(), (0, preserveAnnotation_js_1.preserveAnnotation)(propertyType, newType), this.isMappedPropertyRequired(node, hasUndefined));
            result.push(objectProperty);
            return result;
        }, []);
    }
    getValues(node, keyListType, context) {
        return keyListType
            .getValues()
            .filter((value) => value != null)
            .map((value) => {
            const type = this.childNodeParser.createType(node.type, this.createSubContext(node, new LiteralType_js_1.LiteralType(value), context));
            return new ObjectType_js_1.ObjectProperty(value.toString(), type, this.isMappedPropertyRequired(node, false));
        });
    }
    getAdditionalProperties(node, keyListType, context) {
        if ((0, derefType_js_1.isDeepLiteralUnion)(keyListType)) {
            return this.additionalProperties;
        }
        const key = keyListType.getTypes().filter((type) => !((0, derefType_js_1.derefType)(type) instanceof LiteralType_js_1.LiteralType))[0];
        if (key) {
            return (this.childNodeParser.createType(node.type, this.createSubContext(node, key, context)) ??
                this.additionalProperties);
        }
        return this.additionalProperties;
    }
    createSubContext(node, key, parentContext) {
        const subContext = new NodeParser_js_1.Context(node);
        for (const parentParameter of parentContext.getParameters()) {
            subContext.pushParameter(parentParameter);
            subContext.pushArgument(parentContext.getArgument(parentParameter));
        }
        subContext.pushParameter(node.typeParameter.name.text);
        subContext.pushArgument(key);
        return subContext;
    }
}
exports.MappedTypeNodeParser = MappedTypeNodeParser;
//# sourceMappingURL=MappedTypeNodeParser.js.map