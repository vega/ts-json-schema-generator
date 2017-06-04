"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var path_1 = require("path");
var formatter_1 = require("../factory/formatter");
var parser_1 = require("../factory/parser");
var program_1 = require("../factory/program");
var SchemaGenerator_1 = require("../src/SchemaGenerator");
var basePath = "test/invalid-data";
function assertSchema(name, type) {
    it(name, function () {
        var config = {
            path: path_1.resolve(basePath + "/" + name + "/*.ts"),
            type: type,
            expose: "export",
            topRef: true,
            jsDoc: "none",
        };
        var program = program_1.createProgram(config);
        var generator = new SchemaGenerator_1.SchemaGenerator(program, parser_1.createParser(program, config), formatter_1.createFormatter(config));
        chai_1.assert.throws(function () { return generator.createSchema(type); });
    });
}
describe("invalid-data", function () {
    assertSchema("script-empty", "MyType");
});
//# sourceMappingURL=invalid-data.test.js.map