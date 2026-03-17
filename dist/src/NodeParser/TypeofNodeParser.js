"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeofNodeParser = void 0;
const tslib_1 = require("tslib");
const typescript_1 = tslib_1.__importDefault(require("typescript"));
const ObjectType_js_1 = require("../Type/ObjectType.js");
const nodeKey_js_1 = require("../Utils/nodeKey.js");
const LiteralType_js_1 = require("../Type/LiteralType.js");
const NeverType_js_1 = require("../Type/NeverType.js");
const FunctionType_js_1 = require("../Type/FunctionType.js");
const Errors_js_1 = require("../Error/Errors.js");
class TypeofNodeParser {
    typeChecker;
    childNodeParser;
    constructor(typeChecker, childNodeParser) {
        this.typeChecker = typeChecker;
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.TypeQuery;
    }
    createType(node, context, reference) {
        let symbol = this.typeChecker.getSymbolAtLocation(node.exprName);
        if (symbol.flags & typescript_1.default.SymbolFlags.Alias) {
            symbol = this.typeChecker.getAliasedSymbol(symbol);
        }
        const valueDec = symbol.valueDeclaration;
        if (!valueDec) {
            if (symbol.name === "globalThis") {
                // avoids crashes on globalThis but we really shoulodn't try to make a schema for globalThis
                return new NeverType_js_1.NeverType();
            }
            throw new Errors_js_1.LogicError(node, `No value declaration found for symbol "${symbol.name}"`);
        }
        if (typescript_1.default.isEnumDeclaration(valueDec)) {
            return this.createObjectFromEnum(valueDec, context, reference);
        }
        if (typescript_1.default.isVariableDeclaration(valueDec) ||
            typescript_1.default.isPropertySignature(valueDec) ||
            typescript_1.default.isPropertyDeclaration(valueDec)) {
            let initializer;
            if (valueDec.type) {
                return this.childNodeParser.createType(valueDec.type, context);
            }
            if ((initializer = valueDec?.initializer)) {
                return this.childNodeParser.createType(initializer, context);
            }
        }
        if (typescript_1.default.isClassDeclaration(valueDec)) {
            return this.childNodeParser.createType(valueDec, context);
        }
        if (typescript_1.default.isPropertyAssignment(valueDec)) {
            return this.childNodeParser.createType(valueDec.initializer, context);
        }
        if (valueDec.kind === typescript_1.default.SyntaxKind.FunctionDeclaration) {
            return new FunctionType_js_1.FunctionType(valueDec);
        }
        throw new Errors_js_1.LogicError(valueDec, `Invalid type query for this declaration. (ts.SyntaxKind = ${valueDec.kind})`);
    }
    createObjectFromEnum(node, context, reference) {
        const id = `typeof-enum-${(0, nodeKey_js_1.getKey)(node, context)}`;
        if (reference) {
            reference.setId(id);
            reference.setName(id);
        }
        let type = null;
        const properties = node.members.map((member) => {
            const name = member.name.getText();
            if (member.initializer) {
                type = this.childNodeParser.createType(member.initializer, context);
            }
            else if (type === null) {
                type = new LiteralType_js_1.LiteralType(0);
            }
            else if (type instanceof LiteralType_js_1.LiteralType && typeof type.getValue() === "number") {
                type = new LiteralType_js_1.LiteralType(+type.getValue() + 1);
            }
            else {
                throw new Errors_js_1.LogicError(member.name, `Enum initializer missing for "${name}"`);
            }
            return new ObjectType_js_1.ObjectProperty(name, type, true);
        });
        return new ObjectType_js_1.ObjectType(id, [], properties, false);
    }
}
exports.TypeofNodeParser = TypeofNodeParser;
//# sourceMappingURL=TypeofNodeParser.js.map