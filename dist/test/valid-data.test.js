"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Ajv = require("ajv");
const chai_1 = require("chai");
const fs_1 = require("fs");
const path_1 = require("path");
const formatter_1 = require("../factory/formatter");
const parser_1 = require("../factory/parser");
const program_1 = require("../factory/program");
const SchemaGenerator_1 = require("../src/SchemaGenerator");
const validator = new Ajv();
const metaSchema = require("ajv/lib/refs/json-schema-draft-06.json");
validator.addMetaSchema(metaSchema);
const basePath = "test/valid-data";
function assertSchema(name, type, only = false) {
    const run = only ? it.only : it;
    run(name, () => {
        const config = {
            path: path_1.resolve(`${basePath}/${name}/*.ts`),
            type: type,
            expose: "export",
            topRef: true,
            jsDoc: "extended",
            sortProps: true
        };
        const program = program_1.createProgram(config);
        const generator = new SchemaGenerator_1.SchemaGenerator(program, parser_1.createParser(program, config), formatter_1.createFormatter(config));
        const expected = JSON.parse(fs_1.readFileSync(path_1.resolve(`${basePath}/${name}/schema.json`), "utf8"));
        const actual = JSON.parse(JSON.stringify(generator.createSchema(type)));
        chai_1.assert.isObject(actual);
        chai_1.assert.deepEqual(actual, expected);
        validator.validateSchema(actual);
        chai_1.assert.isNull(validator.errors);
    });
}
describe("valid-data", () => {
    assertSchema("custom-tests/root-definition-type", "IStuff");
    assertSchema("custom-tests/oneof", "MyObject");
    assertSchema("custom-tests/record-union", "MyObject");
    assertSchema("custom-tests/extended-interface-typearg", "MyObject");
    assertSchema("type-mapped-pick", 'MyObject');
    assertSchema("type-pick1", "MyObject");
    assertSchema("type-pick2", "MyObject");
    assertSchema("interface-keyvalueify", "MyObject");
    assertSchema("simple-object", "SimpleObject");
    assertSchema("interface-single", "MyObject");
    assertSchema("interface-multi", "MyObject");
    assertSchema("interface-recursion", "MyObject");
    assertSchema("interface-extra-props", "MyObject");
    assertSchema("structure-private", "MyObject");
    assertSchema("structure-anonymous", "MyObject");
    assertSchema("structure-recursion", "MyObject");
    assertSchema("structure-extra-props", "MyObject");
    assertSchema("enums-string", "Enum");
    assertSchema("enums-number", "Enum");
    assertSchema("enums-initialized", "Enum");
    assertSchema("enums-compute", "Enum");
    assertSchema("enums-mixed", "Enum");
    assertSchema("enums-member", "MyObject");
    assertSchema("string-literals", "MyObject");
    assertSchema("string-literals-inline", "MyObject");
    assertSchema("string-literals-null", "MyObject");
    assertSchema("namespace-deep-1", "RootNamespace.Def");
    assertSchema("namespace-deep-2", "RootNamespace.SubNamespace.HelperA");
    assertSchema("namespace-deep-3", "RootNamespace.SubNamespace.HelperB");
    assertSchema("import-simple", "MyObject");
    assertSchema("import-exposed", "MyObject");
    assertSchema("import-anonymous", "MyObject");
    assertSchema("type-aliases-primitive", "MyString");
    assertSchema("type-aliases-object", "MyAlias");
    assertSchema("type-aliases-mixed", "MyObject");
    assertSchema("type-aliases-union", "MyUnion");
    assertSchema("type-aliases-union-array", "MyUnion");
    assertSchema("type-aliases-tuple", "MyTuple");
    assertSchema("type-aliases-anonymous", "MyObject");
    assertSchema("type-aliases-local-namespace", "MyObject");
    assertSchema("type-aliases-recursive-anonymous", "MyAlias");
    assertSchema("type-aliases-recursive-export", "MyObject");
    assertSchema("type-alias-baseType", "MyInterface");
    assertSchema("type-maps", "MyObject");
    assertSchema("type-primitives", "MyObject");
    assertSchema("type-union", "TypeUnion");
    assertSchema("type-union-tagged", "Shape");
    assertSchema("type-intersection", "MyObject");
    assertSchema("type-intersection-additional-props", "MyObject");
    assertSchema("type-typeof", "MyType");
    assertSchema("type-typeof-value", "MyType");
    assertSchema("type-indexed-access", "MyType");
    assertSchema("type-keyof", "MyType");
    assertSchema("type-mapped", "MyObject");
    assertSchema("type-partial1", "MyObject");
    assertSchema("type-partial2", "MyObject");
    assertSchema("type-partial3", "MyObject");
    assertSchema("type-pick1", "MyObject");
    assertSchema("type-pick2", "MyObject");
    assertSchema("generic-simple", "MyObject");
    assertSchema("generic-arrays", "MyObject");
    assertSchema("generic-multiple", "MyObject");
    assertSchema("generic-multiargs", "MyObject");
    assertSchema("generic-anonymous", "MyObject");
    assertSchema("generic-recursive", "MyObject");
    assertSchema("generic-hell", "MyObject");
    assertSchema("nullable-null", "MyObject");
});
//# sourceMappingURL=valid-data.test.js.map