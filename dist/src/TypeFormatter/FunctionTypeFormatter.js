"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunctionTypeFormatter = void 0;
const FunctionType_js_1 = require("../Type/FunctionType.js");
class FunctionTypeFormatter {
    childTypeFormatter;
    functions;
    constructor(childTypeFormatter, functions) {
        this.childTypeFormatter = childTypeFormatter;
        this.functions = functions;
    }
    supportsType(type) {
        return type instanceof FunctionType_js_1.FunctionType;
    }
    getDefinition(type, options) {
        const namedArgs = type.getNamedArguments();
        if (namedArgs) {
            return {
                $comment: type.getComment(),
                type: "object",
                properties: {
                    namedArgs: this.childTypeFormatter.getDefinition(namedArgs, options),
                },
            };
        }
        return {
            $comment: type.getComment(),
        };
    }
    getChildren(type) {
        const namedArgs = type.getNamedArguments();
        return namedArgs ? this.childTypeFormatter.getChildren(namedArgs) : [];
    }
}
exports.FunctionTypeFormatter = FunctionTypeFormatter;
//# sourceMappingURL=FunctionTypeFormatter.js.map