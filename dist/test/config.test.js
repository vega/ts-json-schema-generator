"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Ajv = require("ajv");
var chai_1 = require("chai");
var fs_1 = require("fs");
var path_1 = require("path");
var formatter_1 = require("../factory/formatter");
var parser_1 = require("../factory/parser");
var program_1 = require("../factory/program");
var Config_1 = require("../src/Config");
var SchemaGenerator_1 = require("../src/SchemaGenerator");
var validator = new Ajv();
var metaSchema = require("ajv/lib/refs/json-schema-draft-04.json");
validator.addMetaSchema(metaSchema, "http://json-schema.org/draft-04/schema#");
var basePath = "test/config";
function assertSchema(name, partialConfig) {
    it(name, function () {
        var config = __assign({}, Config_1.DEFAULT_CONFIG, partialConfig, { path: path_1.resolve(basePath + "/" + name + "/*.ts") });
        var program = program_1.createProgram(config);
        var generator = new SchemaGenerator_1.SchemaGenerator(program, parser_1.createParser(program, config), formatter_1.createFormatter(config));
        var expected = JSON.parse(fs_1.readFileSync(path_1.resolve(basePath + "/" + name + "/schema.json"), "utf8"));
        var actual = JSON.parse(JSON.stringify(generator.createSchema(config.type)));
        chai_1.assert.isObject(actual);
        chai_1.assert.deepEqual(actual, expected);
        validator.validateSchema(actual);
        chai_1.assert.equal(validator.errors, null);
    });
}
describe("config", function () {
    assertSchema("expose-all-topref-true", { type: "MyObject", expose: "all", topRef: true, jsDoc: "none" });
    assertSchema("expose-all-topref-false", { type: "MyObject", expose: "all", topRef: false, jsDoc: "none" });
    assertSchema("expose-none-topref-true", { type: "MyObject", expose: "none", topRef: true, jsDoc: "none" });
    assertSchema("expose-none-topref-false", { type: "MyObject", expose: "none", topRef: false, jsDoc: "none" });
    assertSchema("expose-export-topref-true", { type: "MyObject", expose: "export", topRef: true, jsDoc: "none" });
    assertSchema("expose-export-topref-false", { type: "MyObject", expose: "export", topRef: false, jsDoc: "none" });
    assertSchema("jsdoc-complex-none", { type: "MyObject", expose: "export", topRef: true, jsDoc: "none" });
    assertSchema("jsdoc-complex-basic", { type: "MyObject", expose: "export", topRef: true, jsDoc: "basic" });
    assertSchema("jsdoc-complex-extended", { type: "MyObject", expose: "export", topRef: true, jsDoc: "extended" });
    assertSchema("jsdoc-description-only", { type: "MyObject", expose: "export", topRef: true, jsDoc: "extended" });
});
//# sourceMappingURL=config.test.js.map