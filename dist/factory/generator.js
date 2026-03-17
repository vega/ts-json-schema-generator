"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGenerator = createGenerator;
const Config_js_1 = require("../src/Config.js");
const SchemaGenerator_js_1 = require("../src/SchemaGenerator.js");
const formatter_js_1 = require("./formatter.js");
const parser_js_1 = require("./parser.js");
const program_js_1 = require("./program.js");
function createGenerator(config) {
    const completedConfig = { ...Config_js_1.DEFAULT_CONFIG, ...config };
    const program = config.tsProgram || (0, program_js_1.createProgram)(completedConfig);
    const parser = (0, parser_js_1.createParser)(program, completedConfig);
    const formatter = (0, formatter_js_1.createFormatter)(completedConfig);
    return new SchemaGenerator_js_1.SchemaGenerator(program, parser, formatter, completedConfig);
}
//# sourceMappingURL=generator.js.map