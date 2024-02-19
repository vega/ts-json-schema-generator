"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TupleTypeFormatter = void 0;
const ArrayType_1 = require("../Type/ArrayType");
const OptionalType_1 = require("../Type/OptionalType");
const RestType_1 = require("../Type/RestType");
const TupleType_1 = require("../Type/TupleType");
const notNever_1 = require("../Utils/notNever");
const uniqueArray_1 = require("../Utils/uniqueArray");
function uniformRestType(type, check_type) {
    const inner = type.getType();
    return ((inner instanceof ArrayType_1.ArrayType && inner.getItem().getId() === check_type.getId()) ||
        (inner instanceof TupleType_1.TupleType &&
            inner.getTypes().every((tuple_type) => {
                if (tuple_type instanceof RestType_1.RestType) {
                    return uniformRestType(tuple_type, check_type);
                }
                else {
                    return (tuple_type === null || tuple_type === void 0 ? void 0 : tuple_type.getId()) === check_type.getId();
                }
            })));
}
class TupleTypeFormatter {
    constructor(childTypeFormatter) {
        this.childTypeFormatter = childTypeFormatter;
    }
    supportsType(type) {
        return type instanceof TupleType_1.TupleType;
    }
    getDefinition(type) {
        var _a;
        const subTypes = type.getTypes().filter(notNever_1.notNever);
        const requiredElements = subTypes.filter((t) => !(t instanceof OptionalType_1.OptionalType) && !(t instanceof RestType_1.RestType));
        const optionalElements = subTypes.filter((t) => t instanceof OptionalType_1.OptionalType);
        const restType = subTypes.find((t) => t instanceof RestType_1.RestType);
        const firstItemType = requiredElements.length > 0 ? requiredElements[0] : (_a = optionalElements[0]) === null || _a === void 0 ? void 0 : _a.getType();
        const isUniformArray = firstItemType &&
            requiredElements.every((item) => item.getId() === firstItemType.getId()) &&
            optionalElements.every((item) => item.getType().getId() === firstItemType.getId()) &&
            (!restType || uniformRestType(restType, firstItemType));
        if (isUniformArray) {
            return {
                type: "array",
                items: this.childTypeFormatter.getDefinition(firstItemType),
                minItems: requiredElements.length,
                ...(restType ? {} : { maxItems: requiredElements.length + optionalElements.length }),
            };
        }
        const requiredDefinitions = requiredElements.map((item) => this.childTypeFormatter.getDefinition(item));
        const optionalDefinitions = optionalElements.map((item) => this.childTypeFormatter.getDefinition(item));
        const itemsTotal = requiredDefinitions.length + optionalDefinitions.length;
        const additionalItems = restType ? this.childTypeFormatter.getDefinition(restType).items : undefined;
        return {
            type: "array",
            minItems: requiredDefinitions.length,
            ...(itemsTotal ? { items: requiredDefinitions.concat(optionalDefinitions) } : {}),
            ...(!itemsTotal && additionalItems ? { items: additionalItems } : {}),
            ...(!itemsTotal && !additionalItems ? { maxItems: 0 } : {}),
            ...(additionalItems && !Array.isArray(additionalItems) && itemsTotal
                ? { additionalItems: additionalItems }
                : {}),
            ...(!additionalItems && itemsTotal ? { maxItems: itemsTotal } : {}),
        };
    }
    getChildren(type) {
        return (0, uniqueArray_1.uniqueArray)(type
            .getTypes()
            .filter(notNever_1.notNever)
            .reduce((result, item) => [...result, ...this.childTypeFormatter.getChildren(item)], []));
    }
}
exports.TupleTypeFormatter = TupleTypeFormatter;
//# sourceMappingURL=TupleTypeFormatter.js.map