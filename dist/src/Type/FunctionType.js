"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunctionType = void 0;
const BaseType_js_1 = require("./BaseType.js");
class FunctionType extends BaseType_js_1.BaseType {
    namedArguments;
    comment;
    constructor(node, namedArguments) {
        super();
        this.namedArguments = namedArguments;
        if (node) {
            this.comment = `(${node.parameters.map((p) => p.getFullText()).join(",")}) =>${node.type?.getFullText()}`;
        }
    }
    getId() {
        return "function";
    }
    getComment() {
        return this.comment;
    }
    getNamedArguments() {
        return this.namedArguments;
    }
}
exports.FunctionType = FunctionType;
//# sourceMappingURL=FunctionType.js.map