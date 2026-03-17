"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChainTypeFormatter = void 0;
const Errors_js_1 = require("./Error/Errors.js");
class ChainTypeFormatter {
    typeFormatters;
    constructor(typeFormatters) {
        this.typeFormatters = typeFormatters;
    }
    addTypeFormatter(typeFormatter) {
        this.typeFormatters.push(typeFormatter);
        return this;
    }
    supportsType(type) {
        return this.typeFormatters.some((typeFormatter) => typeFormatter.supportsType(type));
    }
    getDefinition(type, options) {
        return this.getTypeFormatter(type).getDefinition(type, options);
    }
    getChildren(type) {
        return this.getTypeFormatter(type).getChildren(type);
    }
    getTypeFormatter(type) {
        for (const typeFormatter of this.typeFormatters) {
            if (typeFormatter.supportsType(type)) {
                return typeFormatter;
            }
        }
        throw new Errors_js_1.UnknownTypeError(type);
    }
}
exports.ChainTypeFormatter = ChainTypeFormatter;
//# sourceMappingURL=ChainTypeFormatter.js.map