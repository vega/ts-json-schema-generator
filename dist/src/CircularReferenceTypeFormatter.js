"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CircularReferenceTypeFormatter = (function () {
    function CircularReferenceTypeFormatter(childTypeFormatter) {
        this.childTypeFormatter = childTypeFormatter;
        this.definition = new Map();
        this.children = new Map();
    }
    CircularReferenceTypeFormatter.prototype.supportsType = function (type) {
        return this.childTypeFormatter.supportsType(type);
    };
    CircularReferenceTypeFormatter.prototype.getDefinition = function (type) {
        if (this.definition.has(type)) {
            return this.definition.get(type);
        }
        var definition = {};
        this.definition.set(type, definition);
        Object.assign(definition, this.childTypeFormatter.getDefinition(type));
        return definition;
    };
    CircularReferenceTypeFormatter.prototype.getChildren = function (type) {
        if (this.children.has(type)) {
            return this.children.get(type);
        }
        var children = [];
        this.children.set(type, children);
        children.push.apply(children, this.childTypeFormatter.getChildren(type));
        return children;
    };
    return CircularReferenceTypeFormatter;
}());
exports.CircularReferenceTypeFormatter = CircularReferenceTypeFormatter;
//# sourceMappingURL=CircularReferenceTypeFormatter.js.map