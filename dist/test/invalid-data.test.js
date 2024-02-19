"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const formatter_1 = require("../factory/formatter");
const parser_1 = require("../factory/parser");
const program_1 = require("../factory/program");
const SchemaGenerator_1 = require("../src/SchemaGenerator");
function assertSchema(name, type, message) {
    return () => {
        const config = {
            path: (0, path_1.resolve)(`test/invalid-data/${name}/*.ts`),
            type: type,
            expose: "export",
            topRef: true,
            jsDoc: "basic",
            skipTypeCheck: !!process.env.FAST_TEST,
        };
        const program = (0, program_1.createProgram)(config);
        const generator = new SchemaGenerator_1.SchemaGenerator(program, (0, parser_1.createParser)(program, config), (0, formatter_1.createFormatter)(config));
        expect(() => generator.createSchema(type)).toThrowError(message);
    };
}
describe("invalid-data", () => {
    it("script-empty", assertSchema("script-empty", "MyType", `No root type "MyType" found`));
    it("duplicates", assertSchema("duplicates", "MyType", `Type "A" has multiple definitions.`));
    it("missing-discriminator", assertSchema("missing-discriminator", "MyType", 'Cannot find discriminator keyword "type" in type ' +
        '{"name":"B","type":{"id":"interface-1119825560-40-63-1119825560-0-124",' +
        '"baseTypes":[],"properties":[],"additionalProperties":false,"nonPrimitive":false}}.'));
    it("non-union-discriminator", assertSchema("non-union-discriminator", "MyType", "Cannot assign discriminator tag to type: " +
        '{"id":"interface-2103469249-0-76-2103469249-0-77","baseTypes":[],' +
        '"properties":[{"name":"name","type":{},"required":true}],' +
        '"additionalProperties":false,"nonPrimitive":false}. ' +
        "This tag can only be assigned to union types."));
    it("duplicate-discriminator", assertSchema("duplicate-discriminator", "MyType", 'Duplicate discriminator values: A in type "(A|B)".'));
    it("no-function-name", assertSchema("function-parameters-declaration-missing-name", "*", `Unknown node "export default function () { }`));
});
//# sourceMappingURL=invalid-data.test.js.map