"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConditionalTypeNodeParser = void 0;
const tslib_1 = require("tslib");
const typescript_1 = tslib_1.__importDefault(require("typescript"));
const NodeParser_js_1 = require("../NodeParser.js");
const isAssignableTo_js_1 = require("../Utils/isAssignableTo.js");
const narrowType_js_1 = require("../Utils/narrowType.js");
const UnionType_js_1 = require("../Type/UnionType.js");
const NeverType_js_1 = require("../Type/NeverType.js");
class CheckType {
    parameterName;
    type;
    constructor(parameterName, type) {
        this.parameterName = parameterName;
        this.type = type;
    }
}
class ConditionalTypeNodeParser {
    typeChecker;
    childNodeParser;
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
        // If check-type is not a type parameter then condition is very simple, no type narrowing needed
        if (checkTypeParameterName == null) {
            const result = (0, isAssignableTo_js_1.isAssignableTo)(extendsType, checkType, inferMap);
            return this.childNodeParser.createType(result ? node.trueType : node.falseType, this.createSubContext(node, context, undefined, result ? inferMap : new Map()));
        }
        // Narrow down check type for both condition branches
        const trueCheckType = (0, narrowType_js_1.narrowType)(checkType, (type) => (0, isAssignableTo_js_1.isAssignableTo)(extendsType, type, inferMap));
        const falseCheckType = (0, narrowType_js_1.narrowType)(checkType, (type) => !(0, isAssignableTo_js_1.isAssignableTo)(extendsType, type));
        // Follow the relevant branches and return the results from them
        const results = [];
        if (!(trueCheckType instanceof NeverType_js_1.NeverType)) {
            const result = this.childNodeParser.createType(node.trueType, this.createSubContext(node, context, new CheckType(checkTypeParameterName, trueCheckType), inferMap));
            if (result) {
                results.push(result);
            }
        }
        if (!(falseCheckType instanceof NeverType_js_1.NeverType)) {
            const result = this.childNodeParser.createType(node.falseType, this.createSubContext(node, context, new CheckType(checkTypeParameterName, falseCheckType)));
            if (result) {
                results.push(result);
            }
        }
        return new UnionType_js_1.UnionType(results).normalize();
    }
    /**
     * Returns the type parameter name of the given type node if any.
     *
     * @param node - The type node for which to return the type parameter name.
     * @return The type parameter name or null if specified type node is not a type parameter.
     */
    getTypeParameterName(node) {
        if (typescript_1.default.isTypeReferenceNode(node)) {
            const typeSymbol = this.typeChecker.getSymbolAtLocation(node.typeName);
            if (typeSymbol.flags & typescript_1.default.SymbolFlags.TypeParameter) {
                return typeSymbol.name;
            }
        }
        return null;
    }
    /**
     * Creates a sub context for evaluating the sub types of the conditional type. A sub context is needed in case
     * the check-type is a type parameter which is then narrowed down by the extends-type.
     *
     * @param node                   - The reference node for the new context.
     * @param checkType              - An object containing the type parameter name of the check-type, and the narrowed
     *                                 down check type to use for the type parameter in sub parsers.
     * @param inferMap               - A map that links parameter names to their inferred types.
     * @return The created sub context.
     */
    createSubContext(node, parentContext, checkType, inferMap = new Map()) {
        const subContext = new NodeParser_js_1.Context(node);
        // Newly inferred types take precedence over check and parent types.
        inferMap.forEach((value, key) => {
            subContext.pushParameter(key);
            subContext.pushArgument(value);
        });
        if (checkType !== undefined) {
            // Set new narrowed type for check type parameter
            if (!(checkType.parameterName in inferMap)) {
                subContext.pushParameter(checkType.parameterName);
                subContext.pushArgument(checkType.type);
            }
        }
        // Copy all other type parameters from parent context
        parentContext.getParameters().forEach((parentParameter) => {
            if (parentParameter !== checkType?.parameterName && !(parentParameter in inferMap)) {
                subContext.pushParameter(parentParameter);
                subContext.pushArgument(parentContext.getArgument(parentParameter));
            }
        });
        return subContext;
    }
}
exports.ConditionalTypeNodeParser = ConditionalTypeNodeParser;
//# sourceMappingURL=ConditionalTypeNodeParser.js.map