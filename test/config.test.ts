import * as Ajv from "ajv";
import { readFileSync } from "fs";
import { resolve } from "path";
import * as ts from "typescript";

import { createFormatter } from "../factory/formatter";
import { createParser } from "../factory/parser";
import { createProgram } from "../factory/program";
import { Config, DEFAULT_CONFIG, PartialConfig } from "../src/Config";
import { SchemaGenerator } from "../src/SchemaGenerator";

const validator = new Ajv();
const metaSchema: object = require("ajv/lib/refs/json-schema-draft-06.json");
validator.addMetaSchema(metaSchema);

const basePath = "test/config";

function assertSchema(
    name: string,
    partialConfig: PartialConfig & { type: string },
) {
    return () => {
        const config: Config = {
            ...DEFAULT_CONFIG,
            ...partialConfig,
            path: resolve(`${basePath}/${name}/*.ts`),
        };

        const program: ts.Program = createProgram(config);
        const generator: SchemaGenerator = new SchemaGenerator(
            program,
            createParser(program, config),
            createFormatter(config),
        );

        const expected: any = JSON.parse(
            readFileSync(resolve(`${basePath}/${name}/schema.json`), "utf8"),
        );
        const actual: any = JSON.parse(
            JSON.stringify(generator.createSchema(config.type)),
        );

        expect(typeof actual).toBe("object");
        expect(actual).toEqual(expected);

        validator.validateSchema(actual);
        expect(validator.errors).toBeNull();
    };
}

describe("config", () => {
    it(
        "expose-all-topref-true",
        assertSchema("expose-all-topref-true", {
            type: "MyObject",
            expose: "all",
            topRef: true,
            jsDoc: "none",
        }),
    );
    it(
        "expose-all-topref-false",
        assertSchema("expose-all-topref-false", {
            type: "MyObject",
            expose: "all",
            topRef: false,
            jsDoc: "none",
        }),
    );

    it(
        "expose-none-topref-true",
        assertSchema("expose-none-topref-true", {
            type: "MyObject",
            expose: "none",
            topRef: true,
            jsDoc: "none",
        }),
    );
    it(
        "expose-none-topref-false",
        assertSchema("expose-none-topref-false", {
            type: "MyObject",
            expose: "none",
            topRef: false,
            jsDoc: "none",
        }),
    );

    it(
        "expose-export-topref-true",
        assertSchema("expose-export-topref-true", {
            type: "MyObject",
            expose: "export",
            topRef: true,
            jsDoc: "none",
        }),
    );
    it(
        "expose-export-topref-false",
        assertSchema("expose-export-topref-false", {
            type: "MyObject",
            expose: "export",
            topRef: false,
            jsDoc: "none",
        }),
    );

    it(
        "jsdoc-complex-none",
        assertSchema("jsdoc-complex-none", {
            type: "MyObject",
            expose: "export",
            topRef: true,
            jsDoc: "none",
        }),
    );
    it(
        "jsdoc-complex-basic",
        assertSchema("jsdoc-complex-basic", {
            type: "MyObject",
            expose: "export",
            topRef: true,
            jsDoc: "basic",
        }),
    );
    it(
        "jsdoc-complex-extended",
        assertSchema("jsdoc-complex-extended", {
            type: "MyObject",
            expose: "export",
            topRef: true,
            jsDoc: "extended",
        }),
    );
    it(
        "jsdoc-description-only",
        assertSchema("jsdoc-description-only", {
            type: "MyObject",
            expose: "export",
            topRef: true,
            jsDoc: "extended",
        }),
    );

    it(
        "jsdoc-hide",
        assertSchema("jsdoc-hide", {
            type: "MyObject",
            expose: "export",
            topRef: true,
            jsDoc: "extended",
        }),
    );
    it(
        "jsdoc-inheritance",
        assertSchema("jsdoc-inheritance", {
            type: "MyObject",
            expose: "export",
            topRef: true,
            jsDoc: "extended",
        }),
    );

    // ensure that skipping type checking doesn't alter the JSON schema output
    it(
        "jsdoc-complex-extended",
        assertSchema("jsdoc-complex-extended", {
            type: "MyObject",
            expose: "export",
            topRef: true,
            jsDoc: "extended",
            skipTypeCheck: true,
        }),
    );
});
