"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnionTypeFormatter = void 0;
const LiteralType_js_1 = require("../Type/LiteralType.js");
const NeverType_js_1 = require("../Type/NeverType.js");
const UnionType_js_1 = require("../Type/UnionType.js");
const derefType_js_1 = require("../Utils/derefType.js");
const typeKeys_js_1 = require("../Utils/typeKeys.js");
const uniqueArray_js_1 = require("../Utils/uniqueArray.js");
const Errors_js_1 = require("../Error/Errors.js");
class UnionTypeFormatter {
    childTypeFormatter;
    discriminatorType;
    constructor(childTypeFormatter, discriminatorType) {
        this.childTypeFormatter = childTypeFormatter;
        this.discriminatorType = discriminatorType;
    }
    supportsType(type) {
        return type instanceof UnionType_js_1.UnionType;
    }
    getTypeDefinitions(type, options) {
        return type
            .getTypes()
            .filter((item) => !((0, derefType_js_1.derefType)(item) instanceof NeverType_js_1.NeverType))
            .map((item) => this.childTypeFormatter.getDefinition(item, options));
    }
    getJsonSchemaDiscriminatorDefinition(type, options) {
        const definitions = this.getTypeDefinitions(type, options);
        const discriminator = type.getDiscriminator();
        if (!discriminator) {
            throw new Errors_js_1.JsonTypeError("discriminator is undefined", type);
        }
        const kindTypes = type
            .getTypes()
            .filter((item) => !((0, derefType_js_1.derefType)(item) instanceof NeverType_js_1.NeverType))
            .map((item) => (0, typeKeys_js_1.getTypeByKey)(item, new LiteralType_js_1.LiteralType(discriminator)));
        const undefinedIndex = kindTypes.findIndex((item) => item === undefined);
        if (undefinedIndex !== -1) {
            throw new Errors_js_1.JsonTypeError(`Cannot find discriminator keyword "${discriminator}" in type ${type.getTypes()[undefinedIndex].getName()}.`, type);
        }
        const kindDefinitions = kindTypes.map((item) => this.childTypeFormatter.getDefinition(item, options));
        const allOf = [];
        for (let i = 0; i < definitions.length; i++) {
            allOf.push({
                if: {
                    properties: { [discriminator]: kindDefinitions[i] },
                },
                then: definitions[i],
            });
        }
        const kindValues = kindDefinitions
            .flatMap((item) => item.const ?? item.enum)
            .filter((item) => item !== undefined);
        const duplicates = kindValues.filter((item, index) => kindValues.indexOf(item) !== index);
        if (duplicates.length > 0) {
            throw new Errors_js_1.JsonTypeError(`Duplicate discriminator values: ${duplicates.join(", ")} in type ${JSON.stringify(type.getName())}.`, type);
        }
        const properties = {
            [discriminator]: {
                enum: kindValues,
            },
        };
        return { type: "object", properties, required: [discriminator], allOf };
    }
    getOpenApiDiscriminatorDefinition(type, options) {
        const oneOf = this.getTypeDefinitions(type, options);
        const discriminator = type.getDiscriminator();
        if (!discriminator) {
            throw new Errors_js_1.JsonTypeError("discriminator is undefined", type);
        }
        return {
            type: "object",
            discriminator: { propertyName: discriminator },
            required: [discriminator],
            oneOf,
        };
    }
    getDefinition(type, options) {
        const discriminator = type.getDiscriminator();
        if (discriminator !== undefined) {
            if (this.discriminatorType === "open-api")
                return this.getOpenApiDiscriminatorDefinition(type, options);
            return this.getJsonSchemaDiscriminatorDefinition(type, options);
        }
        const definitions = this.getTypeDefinitions(type, options);
        const flattenedDefinitions = [];
        // Flatten anyOf inside anyOf unless the anyOf has an annotation
        for (const def of definitions) {
            const keys = Object.keys(def);
            if (keys.length === 1 && keys[0] === "anyOf") {
                flattenedDefinitions.push(...def.anyOf);
            }
            else {
                flattenedDefinitions.push(def);
            }
        }
        return flattenedDefinitions.length > 1
            ? {
                anyOf: flattenedDefinitions,
            }
            : flattenedDefinitions[0];
    }
    getChildren(type) {
        return (0, uniqueArray_js_1.uniqueArray)(type
            .getTypes()
            .reduce((result, item) => [...result, ...this.childTypeFormatter.getChildren(item)], []));
    }
}
exports.UnionTypeFormatter = UnionTypeFormatter;
//# sourceMappingURL=UnionTypeFormatter.js.map