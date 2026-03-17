"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AliasType = void 0;
const BaseType_js_1 = require("./BaseType.js");
class AliasType extends BaseType_js_1.BaseType {
    id;
    type;
    constructor(id, type) {
        super();
        this.id = id;
        this.type = type;
    }
    getId() {
        return this.id;
    }
    getType() {
        return this.type;
    }
}
exports.AliasType = AliasType;
//# sourceMappingURL=AliasType.js.map