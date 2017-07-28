"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const ObjectType_1 = require("../Type/ObjectType");
const isHidden_1 = require("../Utils/isHidden");
class InterfaceNodeParser {
    constructor(typeChecker, childNodeParser) {
        this.typeChecker = typeChecker;
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        return node.kind === ts.SyntaxKind.InterfaceDeclaration;
    }
    createType(node, context) {
        if (node.typeParameters && node.typeParameters.length) {
            node.typeParameters.forEach((typeParam) => {
                const nameSymbol = this.typeChecker.getSymbolAtLocation(typeParam.name);
                context.pushParameter(nameSymbol.name);
            });
        }
        return new ObjectType_1.ObjectType(this.getTypeId(node, context), this.getBaseTypes(node, context), this.getProperties(node, context), this.getAdditionalProperties(node, context));
    }
    getBaseTypes(node, context) {
        if (!node.heritageClauses) {
            return [];
        }
        return node.heritageClauses.reduce((result, baseType) => {
            return result.concat(baseType.types.map((expression) => {
                return this.childNodeParser.createType(expression, context);
            }));
        }, []);
    }
    getProperties(node, context) {
        return node.members
            .filter((property) => property.kind === ts.SyntaxKind.PropertySignature)
            .reduce((result, propertyNode) => {
            const propertySymbol = propertyNode.symbol;
            if (isHidden_1.isHidden(propertySymbol)) {
                return result;
            }
            const objectProperty = new ObjectType_1.ObjectProperty(propertySymbol.getName(), this.childNodeParser.createType(propertyNode.type, context), !propertyNode.questionToken);
            result.push(objectProperty);
            return result;
        }, []);
    }
    getAdditionalProperties(node, context) {
        const properties = node.members
            .filter((property) => property.kind === ts.SyntaxKind.IndexSignature);
        if (!properties.length) {
            return false;
        }
        const signature = properties[0];
        return this.childNodeParser.createType(signature.type, context);
    }
    getTypeId(node, context) {
        const fullName = `interface-${node.getFullStart()}`;
        const argumentIds = context.getArguments().map((arg) => arg.getId());
        return argumentIds.length ? `${fullName}<${argumentIds.join(",")}>` : fullName;
    }
}
exports.InterfaceNodeParser = InterfaceNodeParser;
//# sourceMappingURL=InterfaceNodeParser.js.map