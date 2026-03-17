"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntrinsicType = void 0;
const PrimitiveType_js_1 = require("./PrimitiveType.js");
class IntrinsicType extends PrimitiveType_js_1.PrimitiveType {
    method;
    argument;
    constructor(method, argument) {
        super();
        this.method = method;
        this.argument = argument;
    }
    getId() {
        return `${this.getMethod().name}<${this.getArgument().getId()}>`;
    }
    getMethod() {
        return this.method;
    }
    getArgument() {
        return this.argument;
    }
}
exports.IntrinsicType = IntrinsicType;
//# sourceMappingURL=IntrinsicType.js.map