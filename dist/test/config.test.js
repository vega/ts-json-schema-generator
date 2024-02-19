"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExampleNullParser = exports.ExampleConstructorParser = exports.ExampleDefinitionOverrideFormatter = exports.ExampleEnumTypeFormatter = exports.ExampleFunctionTypeFormatter = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv_formats_1 = __importDefault(require("ajv-formats"));
const fs_1 = require("fs");
const path_1 = require("path");
const typescript_1 = __importDefault(require("typescript"));
const formatter_1 = require("../factory/formatter");
const parser_1 = require("../factory/parser");
const program_1 = require("../factory/program");
const index_1 = require("../index");
const Config_1 = require("../src/Config");
const SchemaGenerator_1 = require("../src/SchemaGenerator");
const EnumType_1 = require("../src/Type/EnumType");
const FunctionType_1 = require("../src/Type/FunctionType");
const StringType_1 = require("../src/Type/StringType");
const uniqueArray_1 = require("../src/Utils/uniqueArray");
const basePath = "test/config";
function assertSchema(name, userConfig, tsconfig, formatterAugmentor, parserAugmentor) {
    return () => {
        const config = {
            ...Config_1.DEFAULT_CONFIG,
            ...userConfig,
            skipTypeCheck: !!process.env.FAST_TEST,
        };
        if (tsconfig) {
            config.tsconfig = (0, path_1.resolve)(`${basePath}/${name}/tsconfig.json`);
        }
        else {
            config.path = (0, path_1.resolve)(`${basePath}/${name}/*.ts`);
        }
        const program = (0, program_1.createProgram)(config);
        const generator = new SchemaGenerator_1.SchemaGenerator(program, (0, parser_1.createParser)(program, config, parserAugmentor), (0, formatter_1.createFormatter)(config, formatterAugmentor), config);
        const expected = JSON.parse((0, fs_1.readFileSync)((0, path_1.resolve)(`${basePath}/${name}/schema.json`), "utf8"));
        const actual = JSON.parse(JSON.stringify(generator.createSchema(config.type)));
        expect(typeof actual).toBe("object");
        expect(actual).toEqual(expected);
        const validator = new ajv_1.default({
            validateFormats: config.encodeRefs === false ? undefined : true,
            keywords: config.markdownDescription ? ["markdownDescription"] : undefined,
        });
        (0, ajv_formats_1.default)(validator);
        validator.validateSchema(actual);
        expect(validator.errors).toBeNull();
        validator.compile(actual);
    };
}
class ExampleFunctionTypeFormatter {
    supportsType(type) {
        return type instanceof FunctionType_1.FunctionType;
    }
    getDefinition(_type) {
        return {
            type: "object",
            properties: {
                isFunction: {
                    type: "boolean",
                    const: true,
                },
            },
        };
    }
    getChildren(_type) {
        return [];
    }
}
exports.ExampleFunctionTypeFormatter = ExampleFunctionTypeFormatter;
class ExampleEnumTypeFormatter {
    supportsType(type) {
        return type instanceof EnumType_1.EnumType;
    }
    getDefinition(type) {
        return {
            type: "object",
            properties: {
                isEnum: {
                    type: "boolean",
                    const: true,
                },
                enumLength: {
                    type: "number",
                    const: type.getValues().length,
                },
            },
        };
    }
    getChildren(_type) {
        return [];
    }
}
exports.ExampleEnumTypeFormatter = ExampleEnumTypeFormatter;
class ExampleDefinitionOverrideFormatter {
    constructor(childTypeFormatter) {
        this.childTypeFormatter = childTypeFormatter;
    }
    supportsType(type) {
        return type instanceof index_1.DefinitionType;
    }
    getDefinition(type) {
        const ref = type.getName();
        return { $ref: `#/definitions/${ref}`, $comment: "overriden" };
    }
    getChildren(type) {
        return (0, uniqueArray_1.uniqueArray)([type, ...this.childTypeFormatter.getChildren(type.getType())]);
    }
}
exports.ExampleDefinitionOverrideFormatter = ExampleDefinitionOverrideFormatter;
class ExampleConstructorParser {
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.ConstructorType;
    }
    createType(node, context, reference) {
        return new StringType_1.StringType();
    }
}
exports.ExampleConstructorParser = ExampleConstructorParser;
class ExampleNullParser {
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.NullKeyword;
    }
    createType(node, context, reference) {
        return new StringType_1.StringType();
    }
}
exports.ExampleNullParser = ExampleNullParser;
describe("config", () => {
    it("expose-all-topref-true", assertSchema("expose-all-topref-true", {
        type: "MyObject",
        expose: "all",
        topRef: true,
        jsDoc: "none",
    }));
    it("expose-all-topref-true-not-exported", assertSchema("expose-all-topref-true-not-exported", {
        type: "MyObject",
        expose: "all",
        topRef: true,
        jsDoc: "none",
    }));
    it("expose-all-topref-false", assertSchema("expose-all-topref-false", {
        type: "MyObject",
        expose: "all",
        topRef: false,
        jsDoc: "none",
    }));
    it("expose-all-topref-false-not-exported", assertSchema("expose-all-topref-false-not-exported", {
        type: "MyObject",
        expose: "all",
        topRef: false,
        jsDoc: "none",
    }));
    it("expose-none-topref-true", assertSchema("expose-none-topref-true", {
        type: "MyObject",
        expose: "none",
        topRef: true,
        jsDoc: "none",
    }));
    it("expose-none-topref-false", assertSchema("expose-none-topref-false", {
        type: "MyObject",
        expose: "none",
        topRef: false,
        jsDoc: "none",
    }));
    it("expose-export-topref-true", assertSchema("expose-export-topref-true", {
        type: "MyObject",
        expose: "export",
        topRef: true,
        jsDoc: "none",
    }));
    it("expose-export-topref-false", assertSchema("expose-export-topref-false", {
        type: "MyObject",
        expose: "export",
        topRef: false,
        jsDoc: "none",
    }));
    it("jsdoc-complex-none", assertSchema("jsdoc-complex-none", {
        type: "MyObject",
        expose: "export",
        topRef: true,
        jsDoc: "none",
    }));
    it("jsdoc-complex-basic", assertSchema("jsdoc-complex-basic", {
        type: "MyObject",
        expose: "export",
        topRef: true,
        jsDoc: "basic",
    }));
    it("jsdoc-complex-extended", assertSchema("jsdoc-complex-extended", {
        type: "MyObject",
        expose: "export",
        topRef: true,
        jsDoc: "extended",
    }));
    it("jsdoc-description-only", assertSchema("jsdoc-description-only", {
        type: "MyObject",
        expose: "export",
        topRef: true,
        jsDoc: "extended",
    }));
    it("jsdoc-hidden", assertSchema("jsdoc-hidden", {
        type: "MyObject",
        expose: "export",
        topRef: true,
        jsDoc: "extended",
    }));
    it("jsdoc-hidden-types", assertSchema("jsdoc-hidden-types", {
        type: "MyType",
        expose: "export",
        topRef: true,
        jsDoc: "extended",
    }));
    it("jsdoc-hidden-types-intersection", assertSchema("jsdoc-hidden-types-intersection", {
        type: "MyType",
        expose: "export",
        topRef: true,
        jsDoc: "extended",
    }));
    it("jsdoc-inheritance", assertSchema("jsdoc-inheritance", {
        type: "MyObject",
        expose: "export",
        topRef: true,
        jsDoc: "extended",
    }));
    it("jsdoc-inheritance-exclude", assertSchema("jsdoc-inheritance-exclude", {
        type: "MyType",
        expose: "export",
        topRef: true,
        jsDoc: "extended",
    }));
    it("jsdoc-complex-extended", assertSchema("jsdoc-complex-extended", {
        type: "MyObject",
        expose: "export",
        topRef: true,
        jsDoc: "extended",
        skipTypeCheck: true,
    }));
    it("markdown-description", assertSchema("markdown-description", {
        type: "MyObject",
        expose: "export",
        topRef: false,
        jsDoc: "extended",
        sortProps: true,
        markdownDescription: true,
    }));
    it("tsconfig-support", assertSchema("tsconfig-support", {
        type: "MyObject",
        expose: "all",
        topRef: false,
        jsDoc: "none",
    }, true));
    it("no-ref-encode", assertSchema("no-ref-encode", {
        type: "MyObject",
        expose: "all",
        encodeRefs: false,
        topRef: true,
        jsDoc: "none",
    }));
    it("additional-properties", assertSchema("additional-properties", {
        type: "MyObject",
        additionalProperties: true,
    }));
    it("arrow-function-parameters", assertSchema("arrow-function-parameters", {
        type: "NamedParameters<typeof myFunction>",
        expose: "all",
    }));
    it("function-parameters-all", assertSchema("function-parameters-all", {
        type: "*",
    }));
    it("custom-formatter-configuration", assertSchema("custom-formatter-configuration", {
        type: "MyObject",
    }, false, (formatter) => formatter.addTypeFormatter(new ExampleFunctionTypeFormatter())));
    it("custom-formatter-configuration-override", assertSchema("custom-formatter-configuration-override", {
        type: "MyObject",
    }, false, (formatter) => formatter.addTypeFormatter(new ExampleEnumTypeFormatter())));
    it("custom-formatter-configuration-circular", assertSchema("custom-formatter-configuration-circular", {
        type: "MyObject",
    }, false, (formatter, circularReferenceTypeFormatter) => formatter.addTypeFormatter(new ExampleDefinitionOverrideFormatter(circularReferenceTypeFormatter))));
    it("custom-parser-configuration", assertSchema("custom-parser-configuration", {
        type: "MyObject",
    }, false, undefined, (parser) => parser.addNodeParser(new ExampleConstructorParser())));
    it("custom-parser-configuration-override", assertSchema("custom-parser-configuration-override", {
        type: "MyObject",
    }, false, undefined, (parser) => parser.addNodeParser(new ExampleNullParser())));
});
//# sourceMappingURL=config.test.js.map