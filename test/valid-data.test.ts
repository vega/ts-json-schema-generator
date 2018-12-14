import * as Ajv from "ajv";
import { assert } from "chai";
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import * as ts from "typescript";
import { createFormatter } from "../factory/formatter";
import { createParser } from "../factory/parser";
import { createProgram } from "../factory/program";
import { Config } from "../src/Config";
import { SchemaGenerator } from "../src/SchemaGenerator";

const validator = new Ajv();
const metaSchema: object = require("ajv/lib/refs/json-schema-draft-06.json");
validator.addMetaSchema(metaSchema);

const basePath = "test/valid-data";

export type Run = (
    expectation: string,
    callback?: ((this: Mocha.ITestCallbackContext, done: MochaDone) => any) | undefined,
) => Mocha.ITest;

function assertSchema(name: string, type: string, only: boolean = false): void {
    const run: Run = only ? it.only : it;
    run(name, () => {
        const config: Config = {
            path: resolve(`${basePath}/${name}/*.ts`),
            type: type,

            expose: "export",
            topRef: true,
            jsDoc: "none",
        };

        const program: ts.Program = createProgram(config);
        const generator: SchemaGenerator = new SchemaGenerator(
            program,
            createParser(program, config),
            createFormatter(config),
        );

        const schema = generator.createSchema(type);
        const expected: any = JSON.parse(readFileSync(resolve(`${basePath}/${name}/schema.json`), "utf8"));
        const actual: any = JSON.parse(JSON.stringify(schema));

        // uncomment to write test files
        // writeFileSync(resolve(`${basePath}/${name}/schema.json`), JSON.stringify(schema, null, 4), "utf8");

        assert.isObject(actual);
        assert.deepEqual(actual, expected);

        validator.validateSchema(actual);
        assert.isNull(validator.errors);
    });
}

describe("valid-data", () => {
    // TODO: generics recursive

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
    assertSchema("type-aliases-anonymous", "MyObject");
    assertSchema("type-aliases-local-namespace", "MyObject");
    assertSchema("type-aliases-recursive-anonymous", "MyAlias");
    assertSchema("type-aliases-recursive-export", "MyObject");

    assertSchema("type-aliases-tuple", "MyTuple");
    assertSchema("type-aliases-tuple-empty", "MyTuple");
    assertSchema("type-aliases-tuple-optional-items", "MyTuple");
    assertSchema("type-aliases-tuple-rest", "MyTuple");
    assertSchema("type-aliases-tuple-only-rest", "MyTuple");

    assertSchema("type-maps", "MyObject");
    assertSchema("type-primitives", "MyObject");
    assertSchema("type-union", "TypeUnion");
    assertSchema("type-union-tagged", "Shape");
    assertSchema("type-intersection", "MyObject");
    assertSchema("type-intersection-additional-props", "MyObject");

    assertSchema("type-typeof", "MyType");
    assertSchema("type-typeof-value", "MyType");

    assertSchema("type-indexed-access-tuple-1", "MyType");
    assertSchema("type-indexed-access-tuple-2", "MyType");
    assertSchema("type-indexed-access-object-1", "MyType");
    assertSchema("type-indexed-access-object-2", "MyType");
    assertSchema("type-keyof-tuple", "MyType");
    assertSchema("type-keyof-object", "MyType");
    assertSchema("type-mapped-simple", "MyObject");
    assertSchema("type-mapped-index", "MyObject");
    assertSchema("type-mapped-literal", "MyObject");
    assertSchema("type-mapped-generic", "MyObject");
    assertSchema("type-mapped-native", "MyObject");
    assertSchema("type-mapped-native-single-literal", "MyObject");
    assertSchema("type-mapped-widened", "MyObject");

    assertSchema("generic-simple", "MyObject");
    assertSchema("generic-arrays", "MyObject");
    assertSchema("generic-multiple", "MyObject");
    assertSchema("generic-multiargs", "MyObject");
    assertSchema("generic-anonymous", "MyObject");
    assertSchema("generic-recursive", "MyObject");
    assertSchema("generic-hell", "MyObject");
    assertSchema("generic-default", "MyObject");

    assertSchema("nullable-null", "MyObject");

    assertSchema("undefined-alias", "MyType");
    assertSchema("undefined-union", "MyType");
    assertSchema("undefined-property", "MyType");
});
