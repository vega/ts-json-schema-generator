"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CircularReferenceTypeFormatter = void 0;
const uniqueArray_js_1 = require("./Utils/uniqueArray.js");
function safeStringify(obj) {
    const seen = new WeakSet();
    return JSON.stringify(obj, (_key, value) => {
        if (typeof value === "object" && value !== null) {
            if (seen.has(value))
                return "[Circular]";
            seen.add(value);
        }
        return value;
    });
}
class CircularReferenceTypeFormatter {
    childTypeFormatter;
    definition = new Map();
    children = new Map();
    constructor(childTypeFormatter) {
        this.childTypeFormatter = childTypeFormatter;
    }
    supportsType(type) {
        return this.childTypeFormatter.supportsType(type);
    }
    getDefinition(type, options) {
        if (this.definition.has(type)) {
            return this.definition.get(type);
        }
        const definition = {};
        this.definition.set(type, definition);
        Object.assign(definition, this.childTypeFormatter.getDefinition(type, options));
        return definition;
    }
    getChildren(type) {
        if (this.children.has(type)) {
            return this.children.get(type);
        }
        const children = [];
        this.children.set(type, children);
        children.push(...this.childTypeFormatter.getChildren(type));
        return (0, uniqueArray_js_1.uniqueArray)(children);
    }
    /**
     * Recompute all cached definitions that may contain stale data from circular-reference placeholders.
     *
     * During initial processing, when a recursive type (e.g. a class with `children: Node[]`) is being processed, the cache returns {} for it.
     * All definitions computed during that window embed the incomplete placeholder.
     * This method recomputes every cached entry using now-complete member caches.
     *
     * Every entry is checked for convergence because wrapper types (AliasType, AnnotatedType, etc.) may sit between the stale source and the consuming definition,
     * and their cache entries must also propagate the fix before the loop can exit.
     */
    recomputeCachedDefinitions(options) {
        const entries = Array.from(this.definition.entries());
        if (entries.length === 0)
            return;
        // Safety limit for deeply wrapped types
        const MAX_ITERATIONS = 10;
        for (let iteration = 0; iteration < MAX_ITERATIONS; iteration++) {
            let changed = false;
            for (const [type, definition] of entries) {
                const oldJson = safeStringify(definition);
                for (const key of Object.keys(definition)) {
                    delete definition[key];
                }
                Object.assign(definition, this.childTypeFormatter.getDefinition(type, options));
                if (safeStringify(definition) !== oldJson) {
                    changed = true;
                }
            }
            if (!changed)
                break;
        }
    }
}
exports.CircularReferenceTypeFormatter = CircularReferenceTypeFormatter;
//# sourceMappingURL=CircularReferenceTypeFormatter.js.map