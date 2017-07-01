"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("util");
var AnnotatedType_1 = require("../Type/AnnotatedType");
function makeNullable(def) {
    var union = def.oneOf || def.anyOf;
    if (union && union.filter(function (d) { return d.type === null; }).length > 0) {
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
        var subdef = {};
        for (var k in def) {
            if (def.hasOwnProperty(k) && k !== "description" && k !== "title" && k !== "default") {
                var key = k;
                subdef[key] = def[key];
                delete def[key];
            }
        }
        def.anyOf = [subdef, { type: "null" }];
    }
    return def;
}
var AnnotatedTypeFormatter = (function () {
    function AnnotatedTypeFormatter(childTypeFormatter) {
        this.childTypeFormatter = childTypeFormatter;
    }
    AnnotatedTypeFormatter.prototype.supportsType = function (type) {
        return type instanceof AnnotatedType_1.AnnotatedType;
    };
    AnnotatedTypeFormatter.prototype.getDefinition = function (type) {
        var def = __assign({}, this.childTypeFormatter.getDefinition(type.getType()), type.getAnnotations());
        if (type.isNullable()) {
            return makeNullable(def);
        }
        return def;
    };
    AnnotatedTypeFormatter.prototype.getChildren = function (type) {
        return this.childTypeFormatter.getChildren(type.getType());
    };
    return AnnotatedTypeFormatter;
}());
exports.AnnotatedTypeFormatter = AnnotatedTypeFormatter;
//# sourceMappingURL=AnnotatedTypeFormatter.js.map