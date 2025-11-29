import { createFSBackedSystem, createVirtualTypeScriptEnvironment } from "@typescript/vfs";
import assert from "node:assert";
import { it } from "node:test";
import ts from "typescript";
import { createGenerator } from "../../factory/generator";
import type { Config } from "../../src/Config";

it("Can generate a schema from a vfs", () => {
    const tsInterface = `
    /**
     * This is a sample interface
     */
    export interface SampleInterface {
        /** This is a name */
        name: string;
    }
    `;

    const fsMap = new Map<string, string>();
    fsMap.set("/schema.ts", tsInterface);

    // The FS backed API means that it will use the node_modules for lib.d.ts lookups
    const system = createFSBackedSystem(fsMap, __dirname, ts);
    const env = createVirtualTypeScriptEnvironment(system, ["/schema.ts"], ts);
    const program = env.languageService.getProgram();
    if (!program) throw new Error("No program");

    const schemaConfig: Config = { path: "/schema.ts", tsProgram: program };
    const generator = createGenerator(schemaConfig);

    const result = generator.createSchema();
    assert.deepStrictEqual(result, {
        $ref: "#/definitions/SampleInterface",
        $schema: "http://json-schema.org/draft-07/schema#",
        definitions: {
            SampleInterface: {
                additionalProperties: false,
                description: "This is a sample interface",
                properties: {
                    name: {
                        description: "This is a name",
                        type: "string",
                    },
                },
                required: ["name"],
                type: "object",
            },
        },
    });
});
