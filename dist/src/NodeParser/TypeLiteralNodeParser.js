"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeLiteralNodeParser = void 0;
const tslib_1 = require("tslib");
const typescript_1 = tslib_1.__importDefault(require("typescript"));
const NeverType_js_1 = require("../Type/NeverType.js");
const ObjectType_js_1 = require("../Type/ObjectType.js");
const isHidden_js_1 = require("../Utils/isHidden.js");
const nodeKey_js_1 = require("../Utils/nodeKey.js");
class TypeLiteralNodeParser {
    typeChecker;
    childNodeParser;
    additionalProperties;
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
            return new NeverType_js_1.NeverType();
        }
        return new ObjectType_js_1.ObjectType(id, [], properties, this.getAdditionalProperties(node, context));
    }
    getProperties(node, context) {
        let hasRequiredNever = false;
        const properties = node.members
            .filter((element) => typescript_1.default.isPropertySignature(element) || typescript_1.default.isMethodSignature(element))
            .filter((propertyNode) => !(0, isHidden_js_1.isNodeHidden)(propertyNode))
            .map((propertyNode) => new ObjectType_js_1.ObjectProperty(this.getPropertyName(propertyNode.name), this.childNodeParser.createType(propertyNode.type, context), !propertyNode.questionToken))
            .filter((prop) => {
            const type = prop.getType();
            if (prop.isRequired() && type instanceof NeverType_js_1.NeverType) {
                hasRequiredNever = true;
            }
            return !(type instanceof NeverType_js_1.NeverType);
        });
        if (hasRequiredNever) {
            return undefined;
        }
        return properties;
    }
    getAdditionalProperties(node, context) {
        const indexSignature = node.members.find(typescript_1.default.isIndexSignatureDeclaration);
        if (!indexSignature) {
            return this.additionalProperties;
        }
        return this.childNodeParser.createType(indexSignature.type, context) ?? this.additionalProperties;
    }
    getTypeId(node, context) {
        return `structure-${(0, nodeKey_js_1.getKey)(node, context)}`;
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
            // When propertyName was programmatically created, it doesn't have a source file.
            // Then, getText() will throw an error. But, for programmatically created nodes,`
            // `escapedText` or `text` is available.
            // Only `text` will be available when propertyName contains strange characters and it cannot be escaped
            // or if it is a number.
            return propertyName.escapedText ?? propertyName.text;
        }
    }
}
exports.TypeLiteralNodeParser = TypeLiteralNodeParser;
//# sourceMappingURL=TypeLiteralNodeParser.js.map