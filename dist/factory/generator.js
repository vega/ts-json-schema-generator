"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGenerator = void 0;
const SchemaGenerator_1 = require("../src/SchemaGenerator");
const formatter_1 = require("./formatter");
const parser_1 = require("./parser");
const program_1 = require("./program");
function createGenerator(config) {
    const program = (0, program_1.createProgram)(config);
    const parser = (0, parser_1.createParser)(program, config);
    const formatter = (0, formatter_1.createFormatter)(config);
    return new SchemaGenerator_1.SchemaGenerator(program, parser, formatter, config);
}
exports.createGenerator = createGenerator;
//# sourceMappingURL=generator.js.map