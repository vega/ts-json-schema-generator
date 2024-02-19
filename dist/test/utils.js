"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertMissingFormatterFor = exports.assertValidSchema = exports.createGenerator = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv_formats_1 = __importDefault(require("ajv-formats"));
const fs_1 = require("fs");
const path_1 = require("path");
const safe_stable_stringify_1 = __importDefault(require("safe-stable-stringify"));
const formatter_1 = require("../factory/formatter");
const parser_1 = require("../factory/parser");
const program_1 = require("../factory/program");
const Config_1 = require("../src/Config");
const UnknownTypeError_1 = require("../src/Error/UnknownTypeError");
const SchemaGenerator_1 = require("../src/SchemaGenerator");
const validator = new ajv_1.default({ discriminator: true });
(0, ajv_formats_1.default)(validator);
const basePath = "test/valid-data";
function createGenerator(config) {
    const program = (0, program_1.createProgram)(config);
    return new SchemaGenerator_1.SchemaGenerator(program, (0, parser_1.createParser)(program, config), (0, formatter_1.createFormatter)(config), config);
}
exports.createGenerator = createGenerator;
function assertValidSchema(relativePath, type, config_, options) {
    return () => {
        const config = {
            ...Config_1.DEFAULT_CONFIG,
            path: `${basePath}/${relativePath}/*.ts`,
            skipTypeCheck: !!process.env.FAST_TEST,
            type,
            ...config_,
        };
        const generator = createGenerator(config);
        const schema = generator.createSchema(config.type);
        const schemaFile = (0, path_1.resolve)(`${basePath}/${relativePath}/schema.json`);
        if (process.env.UPDATE_SCHEMA) {
            (0, fs_1.writeFileSync)(schemaFile, (0, safe_stable_stringify_1.default)(schema, null, 2) + "\n", "utf8");
        }
        const expected = JSON.parse((0, fs_1.readFileSync)(schemaFile, "utf8"));
        const actual = JSON.parse(JSON.stringify(schema));
        expect(typeof actual).toBe("object");
        expect(actual).toEqual(expected);
        let localValidator = validator;
        if (config.extraTags) {
            localValidator = new ajv_1.default((options === null || options === void 0 ? void 0 : options.ajvOptions) || { strict: false });
            (0, ajv_formats_1.default)(localValidator);
        }
        localValidator.validateSchema(actual);
        expect(localValidator.errors).toBeNull();
        const validate = localValidator.compile(actual);
        if (options === null || options === void 0 ? void 0 : options.invalidSamples) {
            for (const sample of options.invalidSamples) {
                const isValid = validate(sample);
                if (isValid) {
                    console.log("Unexpectedly Valid:", sample);
                }
                expect(isValid).toBe(false);
            }
        }
        if (options === null || options === void 0 ? void 0 : options.validSamples) {
            for (const sample of options.validSamples) {
                const isValid = validate(sample);
                if (!isValid) {
                    console.log("Unexpectedly Invalid:", sample);
                    console.log("AJV Errors:", validate.errors);
                }
                expect(isValid).toBe(true);
            }
        }
    };
}
exports.assertValidSchema = assertValidSchema;
function assertMissingFormatterFor(missingType, relativePath, type) {
    return () => {
        try {
            assertValidSchema(relativePath, type)();
        }
        catch (error) {
            expect(error).toEqual(new UnknownTypeError_1.UnknownTypeError(missingType));
        }
    };
}
exports.assertMissingFormatterFor = assertMissingFormatterFor;
//# sourceMappingURL=utils.js.map