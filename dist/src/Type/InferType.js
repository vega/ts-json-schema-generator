"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InferType = void 0;
const BaseType_1 = require("./BaseType");
class InferType extends BaseType_1.BaseType {
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