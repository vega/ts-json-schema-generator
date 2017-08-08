"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
const AnnotatedType_1 = require("../Type/AnnotatedType");
function makeNullable(def) {
    const union = def.oneOf || def.anyOf;
    if (union && union.filter((d) => d.type === null).length > 0) {
        union.push({ type: "null" });
    }
    else if (def.type && def.type !== "object") {
        if (util_1.isArray(def.type)) {
            if (def.type.indexOf("null") === -1) {
                def.type.push("null");
            }
        }
        else if (def.type !== "null") {
            def.type = [def.type, "null"];
        }
    }
    else {
        const subdef = {};
        for (const k in def) {
            if (def.hasOwnProperty(k) && k !== "description" && k !== "title" && k !== "default") {
                const key = k;
                subdef[key] = def[key];
                delete def[key];
            }
        }
        def.anyOf = [subdef, { type: "null" }];
    }
    return def;
}
class AnnotatedTypeFormatter {
    constructor(childTypeFormatter) {
        this.childTypeFormatter = childTypeFormatter;
    }
    supportsType(type) {
        return type instanceof AnnotatedType_1.AnnotatedType;
    }
    getDefinition(type) {
        const def = Object.assign({}, this.childTypeFormatter.getDefinition(type.getType()), type.getAnnotations());
        if (type.isNullable()) {
            return makeNullable(def);
        }
        return def;
    }
    getChildren(type) {
        return this.childTypeFormatter.getChildren(type.getType());
    }
}
exports.AnnotatedTypeFormatter = AnnotatedTypeFormatter;
//# sourceMappingURL=AnnotatedTypeFormatter.js.map