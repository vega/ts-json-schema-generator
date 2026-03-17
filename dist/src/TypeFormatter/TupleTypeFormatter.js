"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TupleTypeFormatter = void 0;
const ArrayType_js_1 = require("../Type/ArrayType.js");
const OptionalType_js_1 = require("../Type/OptionalType.js");
const RestType_js_1 = require("../Type/RestType.js");
const TupleType_js_1 = require("../Type/TupleType.js");
const derefType_js_1 = require("../Utils/derefType.js");
const notNever_js_1 = require("../Utils/notNever.js");
const uniqueArray_js_1 = require("../Utils/uniqueArray.js");
function getRestAdditionalItems(restType, childTypeFormatter, options) {
    const items = childTypeFormatter.getDefinition(restType, options).items;
    if (items !== undefined) {
        return items;
    }
    const resolvedType = (0, derefType_js_1.derefType)(restType.getType());
    if (!(resolvedType instanceof ArrayType_js_1.ArrayType)) {
        return undefined;
    }
    const resolvedDef = childTypeFormatter.getDefinition(resolvedType, options);
    return resolvedDef.items;
}
function uniformRestType(type, check_type) {
    const inner = type.getType();
    return ((inner instanceof ArrayType_js_1.ArrayType && inner.getItem().getId() === check_type.getId()) ||
        (inner instanceof TupleType_js_1.TupleType &&
            inner.getTypes().every((tuple_type) => {
                if (tuple_type instanceof RestType_js_1.RestType) {
                    return uniformRestType(tuple_type, check_type);
                }
                else {
                    return tuple_type?.getId() === check_type.getId();
                }
            })));
}
class TupleTypeFormatter {
    childTypeFormatter;
    constructor(childTypeFormatter) {
        this.childTypeFormatter = childTypeFormatter;
    }
    supportsType(type) {
        return type instanceof TupleType_js_1.TupleType;
    }
    getDefinition(type, options) {
        const subTypes = type.getTypes().filter(notNever_js_1.notNever);
        const requiredElements = subTypes.filter((t) => !(t instanceof OptionalType_js_1.OptionalType) && !(t instanceof RestType_js_1.RestType));
        const optionalElements = subTypes.filter((t) => t instanceof OptionalType_js_1.OptionalType);
        // NOTE: A maximum of one rest type is assumed.
        const restType = subTypes.find((t) => t instanceof RestType_js_1.RestType);
        const firstItemType = requiredElements.length > 0 ? requiredElements[0] : optionalElements[0]?.getType();
        // Check whether the tuple is of any of the following forms:
        //   [A, A, A]
        //   [A, A, A?]
        //   [A?, A?]
        //   [A, A, A, ...A[]],
        const isUniformArray = firstItemType &&
            requiredElements.every((item) => item.getId() === firstItemType.getId()) &&
            optionalElements.every((item) => item.getType().getId() === firstItemType.getId()) &&
            (!restType || uniformRestType(restType, firstItemType));
        // If so, generate a simple array with minItems (and possibly maxItems) instead.
        if (isUniformArray) {
            return {
                type: "array",
                items: this.childTypeFormatter.getDefinition(firstItemType, options),
                minItems: requiredElements.length,
                ...(restType ? {} : { maxItems: requiredElements.length + optionalElements.length }),
            };
        }
        const requiredDefinitions = requiredElements.map((item) => this.childTypeFormatter.getDefinition(item, options));
        const optionalDefinitions = optionalElements.map((item) => this.childTypeFormatter.getDefinition(item, options));
        const itemsTotal = requiredDefinitions.length + optionalDefinitions.length;
        const additionalItems = restType !== undefined ? getRestAdditionalItems(restType, this.childTypeFormatter, options) : undefined;
        return {
            type: "array",
            minItems: requiredDefinitions.length,
            ...(itemsTotal ? { items: requiredDefinitions.concat(optionalDefinitions) } : {}), // with items
            ...(!itemsTotal && additionalItems ? { items: additionalItems } : {}), // with only rest param
            ...(!itemsTotal && !additionalItems ? { maxItems: 0 } : {}), // empty
            ...(additionalItems && !Array.isArray(additionalItems) && itemsTotal
                ? { additionalItems: additionalItems }
                : {}), // with rest items
            ...(!additionalItems && itemsTotal ? { maxItems: itemsTotal } : {}), // without rest
        };
    }
    getChildren(type) {
        return (0, uniqueArray_js_1.uniqueArray)(type
            .getTypes()
            .filter(notNever_js_1.notNever)
            .reduce((result, item) => [...result, ...this.childTypeFormatter.getChildren(item)], []));
    }
}
exports.TupleTypeFormatter = TupleTypeFormatter;
//# sourceMappingURL=TupleTypeFormatter.js.map