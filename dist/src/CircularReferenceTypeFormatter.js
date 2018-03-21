"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CircularReferenceTypeFormatter {
    constructor(childTypeFormatter) {
        this.childTypeFormatter = childTypeFormatter;
        this.definition = new Map();
        this.children = new Map();
    }
    supportsType(type) {
        return this.childTypeFormatter.supportsType(type);
    }
    getDefinition(type) {
        if (this.definition.has(type)) {
            return this.definition.get(type);
        }
        const definition = {};
        this.definition.set(type, definition);
        Object.assign(definition, this.childTypeFormatter.getDefinition(type));
        return definition;
    }
    getChildren(type) {
        if (this.children.has(type)) {
            return this.children.get(type);
        }
        const children = [];
        this.children.set(type, children);
        children.push(...this.childTypeFormatter.getChildren(type));
        return children;
    }
}
exports.CircularReferenceTypeFormatter = CircularReferenceTypeFormatter;
//# sourceMappingURL=CircularReferenceTypeFormatter.js.map