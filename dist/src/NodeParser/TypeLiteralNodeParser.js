"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeLiteralNodeParser = void 0;
const typescript_1 = __importStar(require("typescript"));
const FunctionType_1 = require("../Type/FunctionType");
const NeverType_1 = require("../Type/NeverType");
const ObjectType_1 = require("../Type/ObjectType");
const isHidden_1 = require("../Utils/isHidden");
const nodeKey_1 = require("../Utils/nodeKey");
class TypeLiteralNodeParser {
    constructor(typeChecker, childNodeParser, additionalProperties) {
        this.typeChecker = typeChecker;
        this.childNodeParser = childNodeParser;
        this.additionalProperties = additionalProperties;
    }
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.TypeLiteral;
    }
    createType(node, context, reference) {
        const id = this.getTypeId(node, context);
        if (reference) {
            reference.setId(id);
            reference.setName(id);
        }
        const properties = this.getProperties(node, context);
        if (properties === undefined) {
            return new NeverType_1.NeverType();
        }
        return new ObjectType_1.ObjectType(id, [], properties, this.getAdditionalProperties(node, context));
    }
    getProperties(node, context) {
        let hasRequiredNever = false;
        const properties = node.members
            .filter((element) => typescript_1.default.isPropertySignature(element) || typescript_1.default.isMethodSignature(element))
            .filter((propertyNode) => !(0, isHidden_1.isNodeHidden)(propertyNode))
            .map((propertyNode) => new ObjectType_1.ObjectProperty(this.getPropertyName(propertyNode.name), (0, typescript_1.isPropertySignature)(propertyNode)
            ? this.childNodeParser.createType(propertyNode.type, context)
            : new FunctionType_1.FunctionType(), !propertyNode.questionToken))
            .filter((prop) => {
            if (prop.isRequired() && prop.getType() instanceof NeverType_1.NeverType) {
                hasRequiredNever = true;
            }
            return !(prop.getType() instanceof NeverType_1.NeverType);
        });
        if (hasRequiredNever) {
            return undefined;
        }
        return properties;
    }
    getAdditionalProperties(node, context) {
        var _a;
        const indexSignature = node.members.find(typescript_1.default.isIndexSignatureDeclaration);
        if (!indexSignature) {
            return this.additionalProperties;
        }
        return (_a = this.childNodeParser.createType(indexSignature.type, context)) !== null && _a !== void 0 ? _a : this.additionalProperties;
    }
    getTypeId(node, context) {
        return `structure-${(0, nodeKey_1.getKey)(node, context)}`;
    }
    getPropertyName(propertyName) {
        if (propertyName.kind === typescript_1.default.SyntaxKind.ComputedPropertyName) {
            const symbol = this.typeChecker.getSymbolAtLocation(propertyName);
            if (symbol) {
                return symbol.getName();
            }
        }
        try {
            return propertyName.getText();
        }
        catch {
            return propertyName.escapedText;
        }
    }
}
exports.TypeLiteralNodeParser = TypeLiteralNodeParser;
//# sourceMappingURL=TypeLiteralNodeParser.js.map