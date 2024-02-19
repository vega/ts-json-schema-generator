"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MappedTypeNodeParser = void 0;
const typescript_1 = __importDefault(require("typescript"));
const LogicError_1 = require("../Error/LogicError");
const NodeParser_1 = require("../NodeParser");
const AnnotatedType_1 = require("../Type/AnnotatedType");
const ArrayType_1 = require("../Type/ArrayType");
const DefinitionType_1 = require("../Type/DefinitionType");
const EnumType_1 = require("../Type/EnumType");
const LiteralType_1 = require("../Type/LiteralType");
const NeverType_1 = require("../Type/NeverType");
const NumberType_1 = require("../Type/NumberType");
const ObjectType_1 = require("../Type/ObjectType");
const StringType_1 = require("../Type/StringType");
const SymbolType_1 = require("../Type/SymbolType");
const UnionType_1 = require("../Type/UnionType");
const derefType_1 = require("../Utils/derefType");
const nodeKey_1 = require("../Utils/nodeKey");
const preserveAnnotation_1 = require("../Utils/preserveAnnotation");
const removeUndefined_1 = require("../Utils/removeUndefined");
class MappedTypeNodeParser {
    constructor(childNodeParser, additionalProperties) {
        this.childNodeParser = childNodeParser;
        this.additionalProperties = additionalProperties;
    }
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.MappedType;
    }
    createType(node, context) {
        const constraintType = this.childNodeParser.createType(node.typeParameter.constraint, context);
        const keyListType = (0, derefType_1.derefType)(constraintType);
        const id = `indexed-type-${(0, nodeKey_1.getKey)(node, context)}`;
        if (keyListType instanceof UnionType_1.UnionType) {
            return new ObjectType_1.ObjectType(id, [], this.getProperties(node, keyListType, context), this.getAdditionalProperties(node, keyListType, context));
        }
        else if (keyListType instanceof LiteralType_1.LiteralType) {
            return new ObjectType_1.ObjectType(id, [], this.getProperties(node, new UnionType_1.UnionType([keyListType]), context), false);
        }
        else if (keyListType instanceof StringType_1.StringType ||
            keyListType instanceof NumberType_1.NumberType ||
            keyListType instanceof SymbolType_1.SymbolType) {
            if ((constraintType === null || constraintType === void 0 ? void 0 : constraintType.getId()) === "number") {
                const type = this.childNodeParser.createType(node.type, this.createSubContext(node, keyListType, context));
                return type instanceof NeverType_1.NeverType ? new NeverType_1.NeverType() : new ArrayType_1.ArrayType(type);
            }
            const type = this.childNodeParser.createType(node.type, context);
            const resultType = new ObjectType_1.ObjectType(id, [], [], type);
            if (resultType) {
                let annotations;
                if (constraintType instanceof AnnotatedType_1.AnnotatedType) {
                    annotations = constraintType.getAnnotations();
                }
                else if (constraintType instanceof DefinitionType_1.DefinitionType) {
                    const childType = constraintType.getType();
                    if (childType instanceof AnnotatedType_1.AnnotatedType) {
                        annotations = childType.getAnnotations();
                    }
                }
                if (annotations) {
                    return new AnnotatedType_1.AnnotatedType(resultType, { propertyNames: annotations }, false);
                }
            }
            return resultType;
        }
        else if (keyListType instanceof EnumType_1.EnumType) {
            return new ObjectType_1.ObjectType(id, [], this.getValues(node, keyListType, context), false);
        }
        else if (keyListType instanceof NeverType_1.NeverType) {
            return new ObjectType_1.ObjectType(id, [], [], false);
        }
        else {
            throw new LogicError_1.LogicError(`Unexpected key type "${constraintType ? constraintType.getId() : constraintType}" for type "${node.getText()}" (expected "UnionType" or "StringType")`);
        }
    }
    mapKey(node, rawKey, context) {
        if (!node.nameType) {
            return rawKey;
        }
        const key = (0, derefType_1.derefType)(this.childNodeParser.createType(node.nameType, this.createSubContext(node, rawKey, context)));
        return key;
    }
    getProperties(node, keyListType, context) {
        return keyListType
            .getTypes()
            .filter((type) => type instanceof LiteralType_1.LiteralType)
            .map((type) => [type, this.mapKey(node, type, context)])
            .filter((value) => value[1] instanceof LiteralType_1.LiteralType)
            .reduce((result, [key, mappedKey]) => {
            const propertyType = this.childNodeParser.createType(node.type, this.createSubContext(node, key, context));
            let newType = (0, derefType_1.derefAnnotatedType)(propertyType);
            let hasUndefined = false;
            if (newType instanceof UnionType_1.UnionType) {
                const { newType: newType_, numRemoved } = (0, removeUndefined_1.removeUndefined)(newType);
                hasUndefined = numRemoved > 0;
                newType = newType_;
            }
            const objectProperty = new ObjectType_1.ObjectProperty(mappedKey.getValue().toString(), (0, preserveAnnotation_1.preserveAnnotation)(propertyType, newType), !node.questionToken && !hasUndefined);
            result.push(objectProperty);
            return result;
        }, []);
    }
    getValues(node, keyListType, context) {
        return keyListType
            .getValues()
            .filter((value) => value != null)
            .map((value) => {
            const type = this.childNodeParser.createType(node.type, this.createSubContext(node, new LiteralType_1.LiteralType(value), context));
            return new ObjectType_1.ObjectProperty(value.toString(), type, !node.questionToken);
        });
    }
    getAdditionalProperties(node, keyListType, context) {
        var _a;
        const key = keyListType.getTypes().filter((type) => !(type instanceof LiteralType_1.LiteralType))[0];
        if (key) {
            return ((_a = this.childNodeParser.createType(node.type, this.createSubContext(node, key, context))) !== null && _a !== void 0 ? _a : this.additionalProperties);
        }
        else {
            return this.additionalProperties;
        }
    }
    createSubContext(node, key, parentContext) {
        const subContext = new NodeParser_1.Context(node);
        parentContext.getParameters().forEach((parentParameter) => {
            subContext.pushParameter(parentParameter);
            subContext.pushArgument(parentContext.getArgument(parentParameter));
        });
        subContext.pushParameter(node.typeParameter.name.text);
        subContext.pushArgument(key);
        return subContext;
    }
}
exports.MappedTypeNodeParser = MappedTypeNodeParser;
//# sourceMappingURL=MappedTypeNodeParser.js.map