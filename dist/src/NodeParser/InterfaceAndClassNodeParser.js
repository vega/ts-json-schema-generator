"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterfaceAndClassNodeParser = void 0;
const tslib_1 = require("tslib");
const typescript_1 = tslib_1.__importDefault(require("typescript"));
const ArrayType_js_1 = require("../Type/ArrayType.js");
const NeverType_js_1 = require("../Type/NeverType.js");
const ObjectType_js_1 = require("../Type/ObjectType.js");
const isHidden_js_1 = require("../Utils/isHidden.js");
const modifiers_js_1 = require("../Utils/modifiers.js");
const nodeKey_js_1 = require("../Utils/nodeKey.js");
class InterfaceAndClassNodeParser {
    typeChecker;
    childNodeParser;
    additionalProperties;
    constructor(typeChecker, childNodeParser, additionalProperties) {
        this.typeChecker = typeChecker;
        this.childNodeParser = childNodeParser;
        this.additionalProperties = additionalProperties;
    }
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.InterfaceDeclaration || node.kind === typescript_1.default.SyntaxKind.ClassDeclaration;
    }
    createType(node, context, reference) {
        if (node.typeParameters?.length) {
            node.typeParameters.forEach((typeParam) => {
                const nameSymbol = this.typeChecker.getSymbolAtLocation(typeParam.name);
                context.pushParameter(nameSymbol.name);
                if (typeParam.default) {
                    const type = this.childNodeParser.createType(typeParam.default, context);
                    context.setDefault(nameSymbol.name, type);
                }
            });
        }
        const id = this.getTypeId(node, context);
        if (reference) {
            reference.setId(id);
            reference.setName(id);
        }
        const properties = this.getProperties(node, context);
        if (properties === undefined) {
            return new NeverType_js_1.NeverType();
        }
        const additionalProperties = this.getAdditionalProperties(node, context);
        // When type only extends Array or ReadonlyArray then create an array type instead of an object type
        if (properties.length === 0 && additionalProperties === false) {
            const arrayItemType = this.getArrayItemType(node);
            if (arrayItemType) {
                return new ArrayType_js_1.ArrayType(this.childNodeParser.createType(arrayItemType, context));
            }
        }
        return new ObjectType_js_1.ObjectType(id, this.getBaseTypes(node, context), properties, additionalProperties);
    }
    /**
     * If specified node extends Array or ReadonlyArray and nothing else then this method returns the
     * array item type. In all other cases null is returned to indicate that the node is not a simple array.
     *
     * @param node - The interface or class to check.
     * @return The array item type if node is an array, null otherwise.
     */
    getArrayItemType(node) {
        if (node.heritageClauses && node.heritageClauses.length === 1) {
            const clause = node.heritageClauses[0];
            if (clause.types.length === 1) {
                const type = clause.types[0];
                const symbol = this.typeChecker.getSymbolAtLocation(type.expression);
                if (symbol && (symbol.name === "Array" || symbol.name === "ReadonlyArray")) {
                    const typeArguments = type.typeArguments;
                    if (typeArguments?.length === 1) {
                        return typeArguments[0];
                    }
                }
            }
        }
        return null;
    }
    getBaseTypes(node, context) {
        if (!node.heritageClauses) {
            return [];
        }
        return node.heritageClauses.reduce((result, baseType) => [
            ...result,
            ...baseType.types.map((expression) => this.childNodeParser.createType(expression, context)),
        ], []);
    }
    getProperties(node, context) {
        let hasRequiredNever = false;
        const properties = node.members
            .reduce((members, member) => {
            if (typescript_1.default.isConstructorDeclaration(member)) {
                const params = member.parameters.filter((param) => typescript_1.default.isParameterPropertyDeclaration(param, param.parent));
                members.push(...params);
            }
            else if (typescript_1.default.isPropertySignature(member) || typescript_1.default.isPropertyDeclaration(member)) {
                members.push(member);
            }
            return members;
        }, [])
            .filter((member) => (0, modifiers_js_1.isPublic)(member) && !(0, modifiers_js_1.isStatic)(member) && !(0, isHidden_js_1.isNodeHidden)(member))
            .reduce((entries, member) => {
            let memberType = member.type;
            // Use the type checker if the member has no explicit type
            // Ignore members without an initializer. They have no useful type.
            if (memberType === undefined && member?.initializer !== undefined) {
                const type = this.typeChecker.getTypeAtLocation(member);
                memberType = this.typeChecker.typeToTypeNode(type, node, typescript_1.default.NodeBuilderFlags.NoTruncation);
            }
            if (memberType !== undefined) {
                return [...entries, { member, memberType }];
            }
            return entries;
        }, [])
            .map(({ member, memberType }) => new ObjectType_js_1.ObjectProperty(this.getPropertyName(member.name), this.childNodeParser.createType(memberType, context), !member.questionToken))
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
        const nodeType = typescript_1.default.isInterfaceDeclaration(node) ? "interface" : "class";
        return `${nodeType}-${(0, nodeKey_js_1.getKey)(node, context)}`;
    }
    getPropertyName(propertyName) {
        if (propertyName.kind === typescript_1.default.SyntaxKind.ComputedPropertyName) {
            const symbol = this.typeChecker.getSymbolAtLocation(propertyName);
            if (symbol) {
                return symbol.getName();
            }
        }
        return propertyName.getText();
    }
}
exports.InterfaceAndClassNodeParser = InterfaceAndClassNodeParser;
//# sourceMappingURL=InterfaceAndClassNodeParser.js.map