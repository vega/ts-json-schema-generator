"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromiseNodeParser = void 0;
const tslib_1 = require("tslib");
const typescript_1 = tslib_1.__importDefault(require("typescript"));
const Errors_js_1 = require("../Error/Errors.js");
const NodeParser_js_1 = require("../NodeParser.js");
const AliasType_js_1 = require("../Type/AliasType.js");
const DefinitionType_js_1 = require("../Type/DefinitionType.js");
const nodeKey_js_1 = require("../Utils/nodeKey.js");
/**
 * Needs to be registered before 261, 260, 230, 262 node kinds
 */
class PromiseNodeParser {
    typeChecker;
    childNodeParser;
    constructor(typeChecker, childNodeParser) {
        this.typeChecker = typeChecker;
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        if (
        // 261  interface PromiseInterface extends Promise<T>
        !typescript_1.default.isInterfaceDeclaration(node) &&
            // 260  class PromiseClass implements Promise<T>
            !typescript_1.default.isClassDeclaration(node) &&
            // 230  Promise<T>
            !typescript_1.default.isExpressionWithTypeArguments(node) &&
            // 262  type PromiseAlias = Promise<T>;
            !typescript_1.default.isTypeAliasDeclaration(node)) {
            return false;
        }
        const type = this.typeChecker.getTypeAtLocation(node);
        const awaitedType = this.typeChecker.getAwaitedType(type);
        // ignores non awaitable types
        if (!awaitedType) {
            return false;
        }
        // If the awaited type differs from the original type, the type extends promise
        // Awaited<Promise<T>> -> T (Promise<T> !== T)
        // Awaited<Y> -> Y (Y === Y)
        if (awaitedType === type) {
            return false;
        }
        // In types like: A<T> = T, type C = A<1>, C has the same type as A<1> and 1,
        // the awaitedType is NOT the same reference as the type, so a assignability
        // check is needed
        return (!this.typeChecker.isTypeAssignableTo(type, awaitedType) &&
            !this.typeChecker.isTypeAssignableTo(awaitedType, type));
    }
    createType(node, context) {
        const type = this.typeChecker.getTypeAtLocation(node);
        const awaitedType = this.typeChecker.getAwaitedType(type);
        const awaitedNode = this.typeChecker.typeToTypeNode(awaitedType, undefined, typescript_1.default.NodeBuilderFlags.IgnoreErrors);
        if (!awaitedNode) {
            throw new Errors_js_1.ExpectationFailedError("Could not find awaited node", node);
        }
        const baseNode = this.childNodeParser.createType(awaitedNode, new NodeParser_js_1.Context(node));
        const name = this.getNodeName(node);
        // Nodes without name should just be their awaited type
        // export class extends Promise<T> {} -> T
        // export class A extends Promise<T> {} -> A (ref to T)
        if (!name) {
            return baseNode;
        }
        return new DefinitionType_js_1.DefinitionType(name, new AliasType_js_1.AliasType(`promise-${(0, nodeKey_js_1.getKey)(node, context)}`, baseNode));
    }
    getNodeName(node) {
        if (typescript_1.default.isExpressionWithTypeArguments(node)) {
            if (!typescript_1.default.isHeritageClause(node.parent)) {
                throw new Errors_js_1.ExpectationFailedError("Expected ExpressionWithTypeArguments to have a HeritageClause parent", node.parent);
            }
            return node.parent.parent.name?.getText();
        }
        return node.name?.getText();
    }
}
exports.PromiseNodeParser = PromiseNodeParser;
//# sourceMappingURL=PromiseNodeParser.js.map