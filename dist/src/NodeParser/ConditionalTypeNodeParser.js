"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConditionalTypeNodeParser = void 0;
const typescript_1 = __importDefault(require("typescript"));
const NodeParser_1 = require("../NodeParser");
const isAssignableTo_1 = require("../Utils/isAssignableTo");
const narrowType_1 = require("../Utils/narrowType");
const UnionType_1 = require("../Type/UnionType");
const NeverType_1 = require("../Type/NeverType");
class CheckType {
    constructor(parameterName, type) {
        this.parameterName = parameterName;
        this.type = type;
    }
}
class ConditionalTypeNodeParser {
    constructor(typeChecker, childNodeParser) {
        this.typeChecker = typeChecker;
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.ConditionalType;
    }
    createType(node, context) {
        const checkType = this.childNodeParser.createType(node.checkType, context);
        const extendsType = this.childNodeParser.createType(node.extendsType, context);
        const checkTypeParameterName = this.getTypeParameterName(node.checkType);
        const inferMap = new Map();
        if (checkTypeParameterName == null) {
            const result = (0, isAssignableTo_1.isAssignableTo)(extendsType, checkType, inferMap);
            return this.childNodeParser.createType(result ? node.trueType : node.falseType, this.createSubContext(node, context, undefined, result ? inferMap : new Map()));
        }
        const trueCheckType = (0, narrowType_1.narrowType)(checkType, (type) => (0, isAssignableTo_1.isAssignableTo)(extendsType, type, inferMap));
        const falseCheckType = (0, narrowType_1.narrowType)(checkType, (type) => !(0, isAssignableTo_1.isAssignableTo)(extendsType, type));
        const results = [];
        if (!(trueCheckType instanceof NeverType_1.NeverType)) {
            const result = this.childNodeParser.createType(node.trueType, this.createSubContext(node, context, new CheckType(checkTypeParameterName, trueCheckType), inferMap));
            if (result) {
                results.push(result);
            }
        }
        if (!(falseCheckType instanceof NeverType_1.NeverType)) {
            const result = this.childNodeParser.createType(node.falseType, this.createSubContext(node, context, new CheckType(checkTypeParameterName, falseCheckType)));
            if (result) {
                results.push(result);
            }
        }
        return new UnionType_1.UnionType(results).normalize();
    }
    getTypeParameterName(node) {
        if (typescript_1.default.isTypeReferenceNode(node)) {
            const typeSymbol = this.typeChecker.getSymbolAtLocation(node.typeName);
            if (typeSymbol.flags & typescript_1.default.SymbolFlags.TypeParameter) {
                return typeSymbol.name;
            }
        }
        return null;
    }
    createSubContext(node, parentContext, checkType, inferMap = new Map()) {
        const subContext = new NodeParser_1.Context(node);
        inferMap.forEach((value, key) => {
            subContext.pushParameter(key);
            subContext.pushArgument(value);
        });
        if (checkType !== undefined) {
            if (!(checkType.parameterName in inferMap)) {
                subContext.pushParameter(checkType.parameterName);
                subContext.pushArgument(checkType.type);
            }
        }
        parentContext.getParameters().forEach((parentParameter) => {
            if (parentParameter !== (checkType === null || checkType === void 0 ? void 0 : checkType.parameterName) && !(parentParameter in inferMap)) {
                subContext.pushParameter(parentParameter);
                subContext.pushArgument(parentContext.getArgument(parentParameter));
            }
        });
        return subContext;
    }
}
exports.ConditionalTypeNodeParser = ConditionalTypeNodeParser;
//# sourceMappingURL=ConditionalTypeNodeParser.js.map