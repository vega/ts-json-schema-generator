"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SchemaGenerator_1 = require("../src/SchemaGenerator");
var formatter_1 = require("./formatter");
var parser_1 = require("./parser");
var program_1 = require("./program");
function createGenerator(config) {
    var program = program_1.createProgram(config);
    var parser = parser_1.createParser(program, config);
    var formatter = formatter_1.createFormatter(config);
    return new SchemaGenerator_1.SchemaGenerator(program, parser, formatter);
}
exports.createGenerator = createGenerator;
//# sourceMappingURL=generator.js.map