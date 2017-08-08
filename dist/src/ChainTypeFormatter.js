"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UnknownTypeError_1 = require("./Error/UnknownTypeError");
class ChainTypeFormatter {
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
    getDefinition(type) {
        return this.getTypeFormatter(type).getDefinition(type);
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
        throw new UnknownTypeError_1.UnknownTypeError(type);
    }
}
exports.ChainTypeFormatter = ChainTypeFormatter;
//# sourceMappingURL=ChainTypeFormatter.js.map