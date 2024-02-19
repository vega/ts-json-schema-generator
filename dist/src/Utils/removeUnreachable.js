"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeUnreachable = void 0;
const DEFINITION_OFFSET = "#/definitions/".length;
function addReachable(definition, definitions, reachable) {
    var _a, _b;
    if (typeof definition === "boolean") {
        return;
    }
    if (definition.$ref) {
        const typeName = decodeURIComponent(definition.$ref.slice(DEFINITION_OFFSET));
        if (reachable.has(typeName) || !isLocalRef(definition.$ref)) {
            return;
        }
        reachable.add(typeName);
        const refDefinition = definitions[typeName];
        if (!refDefinition) {
            throw new Error(`Encountered a reference to a missing definition: "${definition.$ref}". This is a bug.`);
        }
        addReachable(refDefinition, definitions, reachable);
    }
    else if (definition.anyOf) {
        for (const def of definition.anyOf) {
            addReachable(def, definitions, reachable);
        }
    }
    else if (definition.allOf) {
        for (const def of definition.allOf) {
            addReachable(def, definitions, reachable);
        }
    }
    else if (definition.oneOf) {
        for (const def of definition.oneOf) {
            addReachable(def, definitions, reachable);
        }
    }
    else if (definition.not) {
        addReachable(definition.not, definitions, reachable);
    }
    else if ((_a = definition.type) === null || _a === void 0 ? void 0 : _a.includes("object")) {
        for (const prop in definition.properties || {}) {
            const propDefinition = definition.properties[prop];
            addReachable(propDefinition, definitions, reachable);
        }
        const additionalProperties = definition.additionalProperties;
        if (additionalProperties) {
            addReachable(additionalProperties, definitions, reachable);
        }
    }
    else if ((_b = definition.type) === null || _b === void 0 ? void 0 : _b.includes("array")) {
        const items = definition.items;
        if (Array.isArray(items)) {
            for (const item of items) {
                addReachable(item, definitions, reachable);
            }
        }
        else if (items) {
            addReachable(items, definitions, reachable);
        }
    }
    else if (definition.then) {
        addReachable(definition.then, definitions, reachable);
    }
}
function removeUnreachable(rootTypeDefinition, definitions) {
    if (!rootTypeDefinition) {
        return definitions;
    }
    const reachable = new Set();
    addReachable(rootTypeDefinition, definitions, reachable);
    const out = {};
    for (const def of reachable) {
        out[def] = definitions[def];
    }
    return out;
}
exports.removeUnreachable = removeUnreachable;
function isLocalRef(ref) {
    return ref.charAt(0) === "#";
}
//# sourceMappingURL=removeUnreachable.js.map