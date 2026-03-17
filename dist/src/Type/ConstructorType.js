"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConstructorType = void 0;
const BaseType_js_1 = require("./BaseType.js");
class ConstructorType extends BaseType_js_1.BaseType {
    namedArguments;
    comment;
    constructor(node, namedArguments) {
        super();
        this.namedArguments = namedArguments;
        if (node) {
            this.comment = `new (${node.parameters
                .map((p) => p.getFullText())
                .join(",")}) =>${node.type?.getFullText()}`;
        }
    }
    getId() {
        return "constructor";
    }
    getComment() {
        return this.comment;
    }
    getNamedArguments() {
        return this.namedArguments;
    }
}
exports.ConstructorType = ConstructorType;
//# sourceMappingURL=ConstructorType.js.map