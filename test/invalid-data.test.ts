import { resolve } from "path";
import ts from "typescript";
import { createFormatter } from "../factory/formatter";
import { createParser } from "../factory/parser";
import { createProgram } from "../factory/program";
import { Config } from "../src/Config";
import { SchemaGenerator } from "../src/SchemaGenerator";

function assertSchema(name: string, type: string, message: string) {
    return () => {
        const config: Config = {
            path: resolve(`test/invalid-data/${name}/*.ts`),
            type: type,
            expose: "export",
            topRef: true,
            jsDoc: "basic",
            skipTypeCheck: !!process.env.FAST_TEST,
        };

        const program: ts.Program = createProgram(config);
        const generator: SchemaGenerator = new SchemaGenerator(
            program,
            createParser(program, config),
            createFormatter(config)
        );

        expect(() => generator.createSchema(type)).toThrowError(message);
    };
}

describe("invalid-data", () => {
    // TODO: template recursive

    it("script-empty", assertSchema("script-empty", "MyType", `No root type "MyType" found`));
    it("duplicates", assertSchema("duplicates", "MyType", `Type "A" has multiple definitions.`));
    it(
        "missing-discriminator",
        assertSchema(
            "missing-discriminator",
            "MyType",
            'Cannot find discriminator keyword "type" in type ' +
                '{"name":"B","type":{"id":"interface-1119825560-40-63-1119825560-0-124",' +
                '"baseTypes":[],"properties":[],"additionalProperties":false,"nonPrimitive":false}}.'
        )
    );
    it(
        "non-union-discriminator",
        assertSchema(
            "non-union-discriminator",
            "MyType",
            "Cannot assign discriminator tag to type: " +
                '{"id":"interface-2103469249-0-76-2103469249-0-77","baseTypes":[],' +
                '"properties":[{"name":"name","type":{},"required":true}],' +
                '"additionalProperties":false,"nonPrimitive":false}. ' +
                "This tag can only be assigned to union types."
        )
    );
    it(
        "no-function-name",
        assertSchema(
            "function-parameters-declaration-missing-name",
            "*",
            `Unknown node "export default function () { }`
        )
    );
});
