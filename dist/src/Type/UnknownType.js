"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnknownType = void 0;
const BaseType_1 = require("./BaseType");
class UnknownType extends BaseType_1.BaseType {
    constructor(comment) {
        super();
        this.comment = comment;
    }
    getId() {
        return "unknown";
    }
    getComment() {
        return this.comment;
    }
}
exports.UnknownType = UnknownType;
//# sourceMappingURL=UnknownType.js.map