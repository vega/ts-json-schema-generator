import * as Ajv from "ajv";
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import * as ts from "typescript";
import { createFormatter } from "../factory/formatter";
import { createParser } from "../factory/parser";
import { createProgram } from "../factory/program";
import { Config } from "../src/Config";
import { SchemaGenerator } from "../src/SchemaGenerator";

const validator = new Ajv();

const basePath = "test/valid-data";

function assertSchema(name: string, type: string, jsDoc: Config["jsDoc"] = "none", extra?: Config["extraJsonTags"]) {
    return () => {
        const config: Config = {
            path: resolve(`${basePath}/${name}/*.ts`),
            type: type,

            expose: "export",
            topRef: true,
            jsDoc: jsDoc,
            extraJsonTags: extra,
            skipTypeCheck: !!process.env.FAST_TEST,
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
        // writeFileSync(resolve(`${basePath}/${name}/schema.json`), JSON.stringify(schema, null, 4) + "\n", "utf8");

        expect(typeof actual).toBe("object");
        expect(actual).toEqual(expected);

        validator.validateSchema(actual);
        expect(validator.errors).toBeNull();
    };
}

describe("valid-data", () => {
    // TODO: generics recursive
    it("simple-object", assertSchema("simple-object", "SimpleObject"));

    it("interface-single", assertSchema("interface-single", "MyObject"));
    it("interface-multi", assertSchema("interface-multi", "MyObject"));
    it("interface-recursion", assertSchema("interface-recursion", "MyObject"));
    it("interface-extra-props", assertSchema("interface-extra-props", "MyObject"));
    it("interface-array", assertSchema("interface-array", "TagArray"));

    it("class-single", assertSchema("class-single", "MyObject"));
    it("class-multi", assertSchema("class-multi", "MyObject"));
    it("class-recursion", assertSchema("class-recursion", "MyObject"));
    it("class-extra-props", assertSchema("class-extra-props", "MyObject"));
    it("class-inheritance", assertSchema("class-inheritance", "MyObject"));
    it("class-generics", assertSchema("class-generics", "MyObject"));
    it("class-jsdoc", assertSchema("class-jsdoc", "MyObject", "extended"));

    it("structure-private", assertSchema("structure-private", "MyObject"));
    it("structure-anonymous", assertSchema("structure-anonymous", "MyObject"));
    it("structure-recursion", assertSchema("structure-recursion", "MyObject"));
    it("structure-extra-props", assertSchema("structure-extra-props", "MyObject"));

    it("enums-string", assertSchema("enums-string", "Enum"));
    it("enums-number", assertSchema("enums-number", "Enum"));
    it("enums-initialized", assertSchema("enums-initialized", "Enum"));
    it("enums-compute", assertSchema("enums-compute", "Enum"));
    it("enums-mixed", assertSchema("enums-mixed", "Enum"));
    it("enums-member", assertSchema("enums-member", "MyObject"));

    it("string-literals", assertSchema("string-literals", "MyObject"));
    it("string-literals-inline", assertSchema("string-literals-inline", "MyObject"));
    it("string-literals-null", assertSchema("string-literals-null", "MyObject"));

    it("namespace-deep-1", assertSchema("namespace-deep-1", "RootNamespace.Def"));
    it("namespace-deep-2", assertSchema("namespace-deep-2", "RootNamespace.SubNamespace.HelperA"));
    it("namespace-deep-3", assertSchema("namespace-deep-3", "RootNamespace.SubNamespace.HelperB"));

    it("import-simple", assertSchema("import-simple", "MyObject"));
    it("import-exposed", assertSchema("import-exposed", "MyObject"));
    it("import-anonymous", assertSchema("import-anonymous", "MyObject"));

    it("type-aliases-primitive", assertSchema("type-aliases-primitive", "MyString"));
    it("type-aliases-object", assertSchema("type-aliases-object", "MyAlias"));
    it("type-aliases-mixed", assertSchema("type-aliases-mixed", "MyObject"));
    it("type-aliases-union", assertSchema("type-aliases-union", "MyUnion"));
    it("type-aliases-anonymous", assertSchema("type-aliases-anonymous", "MyObject"));
    it("type-aliases-local-namespace", assertSchema("type-aliases-local-namespace", "MyObject"));
    it("type-aliases-recursive-anonymous", assertSchema("type-aliases-recursive-anonymous", "MyAlias"));
    it("type-aliases-recursive-export", assertSchema("type-aliases-recursive-export", "MyObject"));
    it("type-aliases-recursive-generics-anonymous", assertSchema("type-aliases-recursive-generics-anonymous",
        "MyAlias"));
    it("type-aliases-recursive-generics-export", assertSchema("type-aliases-recursive-generics-export", "MyAlias"));

    it("type-aliases-tuple", assertSchema("type-aliases-tuple", "MyTuple"));
    it("type-aliases-tuple-empty", assertSchema("type-aliases-tuple-empty", "MyTuple"));
    it("type-aliases-tuple-optional-items", assertSchema("type-aliases-tuple-optional-items", "MyTuple"));
    it("type-aliases-tuple-rest", assertSchema("type-aliases-tuple-rest", "MyTuple"));
    it("type-aliases-tuple-only-rest", assertSchema("type-aliases-tuple-only-rest", "MyTuple"));

    it("type-maps", assertSchema("type-maps", "MyObject"));
    it("type-primitives", assertSchema("type-primitives", "MyObject"));
    it("type-union", assertSchema("type-union", "TypeUnion"));
    it("type-union-tagged", assertSchema("type-union-tagged", "Shape"));
    it("type-intersection", assertSchema("type-intersection", "MyObject"));
    it("type-intersection-union", assertSchema("type-intersection-union", "MyObject"));
    it("type-intersection-additional-props", assertSchema("type-intersection-additional-props", "MyObject"));

    it("type-typeof", assertSchema("type-typeof", "MyType"));
    it("type-typeof-value", assertSchema("type-typeof-value", "MyType"));

    it("type-indexed-access-tuple-1", assertSchema("type-indexed-access-tuple-1", "MyType"));
    it("type-indexed-access-tuple-2", assertSchema("type-indexed-access-tuple-2", "MyType"));
    it("type-indexed-access-object-1", assertSchema("type-indexed-access-object-1", "MyType"));
    it("type-indexed-access-object-2", assertSchema("type-indexed-access-object-2", "MyType"));
    it("type-keyof-tuple", assertSchema("type-keyof-tuple", "MyType"));
    it("type-keyof-object", assertSchema("type-keyof-object", "MyType"));
    it("type-mapped-simple", assertSchema("type-mapped-simple", "MyObject"));
    it("type-mapped-index", assertSchema("type-mapped-index", "MyObject"));
    it("type-mapped-literal", assertSchema("type-mapped-literal", "MyObject"));
    it("type-mapped-generic", assertSchema("type-mapped-generic", "MyObject"));
    it("type-mapped-native", assertSchema("type-mapped-native", "MyObject"));
    it("type-mapped-native-single-literal", assertSchema("type-mapped-native-single-literal", "MyObject"));
    it("type-mapped-widened", assertSchema("type-mapped-widened", "MyObject"));
    it("type-mapped-optional", assertSchema("type-mapped-optional", "MyObject"));

    it("generic-simple", assertSchema("generic-simple", "MyObject"));
    it("generic-arrays", assertSchema("generic-arrays", "MyObject"));
    it("generic-multiple", assertSchema("generic-multiple", "MyObject"));
    it("generic-multiargs", assertSchema("generic-multiargs", "MyObject"));
    it("generic-anonymous", assertSchema("generic-anonymous", "MyObject"));
    it("generic-recursive", assertSchema("generic-recursive", "MyObject"));
    it("generic-hell", assertSchema("generic-hell", "MyObject"));
    it("generic-default", assertSchema("generic-default", "MyObject"));
    it("generic-prefixed-number", assertSchema("generic-prefixed-number", "MyObject"));

    it("annotation-custom", assertSchema("annotation-custom", "MyObject", "basic", [
        "customNumberProperty",
        "customStringProperty",
        "customComplexProperty",
        "customMultilineProperty",
        "customInvalidProperty",
    ]));

    it("nullable-null", assertSchema("nullable-null", "MyObject"));

    it("undefined-alias", assertSchema("undefined-alias", "MyType"));
    it("undefined-union", assertSchema("undefined-union", "MyType"));
    it("undefined-property", assertSchema("undefined-property", "MyType"));

    it("any-unknown", assertSchema("any-unknown", "MyObject"));

    it("type-conditional-simple", assertSchema("type-conditional-simple", "MyObject"));
    it("type-conditional-inheritance", assertSchema("type-conditional-inheritance", "MyObject"));
    it("type-conditional-union", assertSchema("type-conditional-union", "MyObject"));
    it("type-conditional-enum", assertSchema("type-conditional-enum", "IParameter"));
    it("type-conditional-intersection", assertSchema("type-conditional-intersection", "MyObject"));
    it("type-conditional-exclude", assertSchema("type-conditional-exclude", "MyObject"));
    it("type-conditional-omit", assertSchema("type-conditional-omit", "MyObject"));
});
