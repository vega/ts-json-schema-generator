"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConstructorTypeFormatter = void 0;
const ConstructorType_js_1 = require("../Type/ConstructorType.js");
const FunctionTypeFormatter_js_1 = require("./FunctionTypeFormatter.js");
class ConstructorTypeFormatter extends FunctionTypeFormatter_js_1.FunctionTypeFormatter {
    supportsType(type) {
        return type instanceof ConstructorType_js_1.ConstructorType;
    }
}
exports.ConstructorTypeFormatter = ConstructorTypeFormatter;
//# sourceMappingURL=ConstructorTypeFormatter.js.map