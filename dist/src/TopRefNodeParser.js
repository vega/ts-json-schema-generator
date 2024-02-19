"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopRefNodeParser = void 0;
const DefinitionType_1 = require("./Type/DefinitionType");
class TopRefNodeParser {
    constructor(childNodeParser, fullName, topRef) {
        this.childNodeParser = childNodeParser;
        this.fullName = fullName;
        this.topRef = topRef;
    }
    createType(node, context) {
        const baseType = this.childNodeParser.createType(node, context);
        if (this.topRef && !(baseType instanceof DefinitionType_1.DefinitionType)) {
            return new DefinitionType_1.DefinitionType(this.fullName, baseType);
        }
        else if (!this.topRef && baseType instanceof DefinitionType_1.DefinitionType) {
            return baseType.getType();
        }
        else {
            return baseType;
        }
    }
}
exports.TopRefNodeParser = TopRefNodeParser;
//# sourceMappingURL=TopRefNodeParser.js.map