"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DefinitionType_1 = require("./Type/DefinitionType");
var TopRefNodeParser = (function () {
    function TopRefNodeParser(childNodeParser, fullName, topRef) {
        this.childNodeParser = childNodeParser;
        this.fullName = fullName;
        this.topRef = topRef;
    }
    TopRefNodeParser.prototype.createType = function (node, context) {
        var baseType = this.childNodeParser.createType(node, context);
        if (this.topRef && !(baseType instanceof DefinitionType_1.DefinitionType)) {
            return new DefinitionType_1.DefinitionType(this.fullName, baseType);
        }
        else if (!this.topRef && (baseType instanceof DefinitionType_1.DefinitionType)) {
            return baseType.getType();
        }
        else {
            return baseType;
        }
    };
    return TopRefNodeParser;
}());
exports.TopRefNodeParser = TopRefNodeParser;
//# sourceMappingURL=TopRefNodeParser.js.map