import * as Ajv from "ajv";
import { assert } from "chai";
import { readFileSync } from "fs";
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
            jsDoc: "extended",
            sortProps: true
        };

        const program: ts.Program = createProgram(config);

        const generator: SchemaGenerator = new SchemaGenerator(
            program,
            createParser(program, config),
            createFormatter(config),
        );

        const expected: any = JSON.parse(readFileSync(resolve(`${basePath}/${name}/schema.json`), "utf8"));
        const actual: any = JSON.parse(JSON.stringify(generator.createSchema(type)));
        assert.isObject(actual);
        assert.deepEqual(actual, expected);

        validator.validateSchema(actual);
        assert.isNull(validator.errors);
    });
}

describe("valid-data", () => {
    // TODO: generics recursive

    assertSchema("custom-tests/record-string", "MyObject");
    assertSchema("custom-tests/record-string-one", "MyObject");
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
    assertSchema("type-keyof-one", "MyType");

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
    /** */

});

