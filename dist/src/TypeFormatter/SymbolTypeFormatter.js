"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SymbolTypeFormatter = void 0;
const SymbolType_1 = require("../Type/SymbolType");
class SymbolTypeFormatter {
    supportsType(type) {
        return type instanceof SymbolType_1.SymbolType;
    }
    getDefinition(type) {
        return {};
    }
    getChildren(type) {
        return [];
    }
}
exports.SymbolTypeFormatter = SymbolTypeFormatter;
//# sourceMappingURL=SymbolTypeFormatter.js.map