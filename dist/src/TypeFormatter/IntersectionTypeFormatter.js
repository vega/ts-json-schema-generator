"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const IntersectionType_1 = require("../Type/IntersectionType");
const ObjectType_1 = require("../Type/ObjectType");
const allOfDefinition_1 = require("../Utils/allOfDefinition");
class IntersectionTypeFormatter {
    constructor(childTypeFormatter) {
        this.childTypeFormatter = childTypeFormatter;
    }
    supportsType(type) {
        return type instanceof IntersectionType_1.IntersectionType;
    }
    getDefinition(type) {
        return type.getTypes().reduce(allOfDefinition_1.getAllOfDefinitionReducer(this.childTypeFormatter), { type: "object", additionalProperties: false });
    }
    getChildren(type) {
        return type.getTypes().reduce((result, item) => {
            const slice = item instanceof ObjectType_1.ObjectType ? 0 : 1;
            return [
                ...result,
                ...this.childTypeFormatter.getChildren(item).slice(slice),
            ];
        }, []);
    }
}
exports.IntersectionTypeFormatter = IntersectionTypeFormatter;
//# sourceMappingURL=IntersectionTypeFormatter.js.map