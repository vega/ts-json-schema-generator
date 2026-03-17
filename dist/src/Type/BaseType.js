"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseType = void 0;
class BaseType {
    /**
     * Get the definition name of the type. Override for non-basic types.
     */
    getName() {
        return this.getId();
    }
}
exports.BaseType = BaseType;
//# sourceMappingURL=BaseType.js.map