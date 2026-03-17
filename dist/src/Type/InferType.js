"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InferType = void 0;
const BaseType_js_1 = require("./BaseType.js");
class InferType extends BaseType_js_1.BaseType {
    id;
    constructor(id) {
        super();
        this.id = id;
    }
    getId() {
        return this.id;
    }
}
exports.InferType = InferType;
//# sourceMappingURL=InferType.js.map