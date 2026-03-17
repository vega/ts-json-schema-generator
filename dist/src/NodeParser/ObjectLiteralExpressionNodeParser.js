"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectLiteralExpressionNodeParser = void 0;
const tslib_1 = require("tslib");
const typescript_1 = tslib_1.__importDefault(require("typescript"));
const nodeKey_js_1 = require("../Utils/nodeKey.js");
const ObjectType_js_1 = require("../Type/ObjectType.js");
const Errors_js_1 = require("../Error/Errors.js");
const IntersectionType_js_1 = require("../Type/IntersectionType.js");
class ObjectLiteralExpressionNodeParser {
    childNodeParser;
    checker;
    constructor(childNodeParser, checker) {
        this.childNodeParser = childNodeParser;
        this.checker = checker;
    }
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.ObjectLiteralExpression;
    }
    createType(node, context) {
        const spreadAssignments = [];
        const properties = [];
        for (const prop of node.properties) {
            if (typescript_1.default.isSpreadAssignment(prop)) {
                spreadAssignments.push(prop);
            }
            else {
                properties.push(prop);
            }
        }
        const parsedProperties = this.parseProperties(properties, context);
        const object = new ObjectType_js_1.ObjectType(`object-${(0, nodeKey_js_1.getKey)(node, context)}`, [], parsedProperties, false);
        if (!spreadAssignments.length) {
            return object;
        }
        const types = [object];
        for (const spread of spreadAssignments) {
            const referenced = this.checker.typeToTypeNode(this.checker.getTypeAtLocation(spread.expression), undefined, typescript_1.default.NodeBuilderFlags.NoTruncation);
            if (!referenced) {
                throw new Errors_js_1.ExpectationFailedError("Could not find reference for spread type", spread);
            }
            types.push(this.childNodeParser.createType(referenced, context));
        }
        return new IntersectionType_js_1.IntersectionType(types);
    }
    parseProperties(properties, context) {
        return properties.flatMap((t) => {
            // parsed previously
            if (typescript_1.default.isSpreadAssignment(t)) {
                return [];
            }
            if (!t.name) {
                throw new Errors_js_1.UnknownNodeError(t);
            }
            let type;
            if (typescript_1.default.isShorthandPropertyAssignment(t)) {
                type = this.checker.typeToTypeNode(this.checker.getTypeAtLocation(t), undefined, typescript_1.default.NodeBuilderFlags.NoTruncation);
            }
            else if (typescript_1.default.isPropertyAssignment(t)) {
                type = t.initializer;
            }
            else {
                type = t;
            }
            if (!type) {
                throw new Errors_js_1.ExpectationFailedError("Could not find type for property", t);
            }
            return new ObjectType_js_1.ObjectProperty(t.name.getText(), this.childNodeParser.createType(type, context), !t.questionToken);
        });
    }
}
exports.ObjectLiteralExpressionNodeParser = ObjectLiteralExpressionNodeParser;
//# sourceMappingURL=ObjectLiteralExpressionNodeParser.js.map