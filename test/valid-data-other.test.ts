import { assertValidSchema } from "./utils";

describe("valid-data-other", () => {
    it("enums-string", assertValidSchema("enums-string", { type: "Enum" }));
    it("enums-number", assertValidSchema("enums-number", { type: "Enum" }));
    it("enums-initialized", assertValidSchema("enums-initialized", { type: "Enum" }));
    it("enums-compute", assertValidSchema("enums-compute", { type: "Enum" }));
    it("enums-mixed", assertValidSchema("enums-mixed", { type: "Enum" }));
    it("enums-member", assertValidSchema("enums-member", { type: "MyObject" }));

    it(
        "function-parameters-default-value",
        assertValidSchema("function-parameters-default-value", { type: "NamedParameters<typeof myFunction>" })
    );
    it(
        "function-parameters-declaration",
        assertValidSchema("function-parameters-declaration", { type: "NamedParameters<typeof myFunction>" })
    );
    it(
        "function-parameters-jsdoc",
        assertValidSchema("function-parameters-jsdoc", { type: "NamedParameters<typeof myFunction>", jsDoc: "basic" })
    );
    it(
        "function-parameters-optional",
        assertValidSchema("function-parameters-optional", { type: "NamedParameters<typeof myFunction>" })
    );
    it(
        "function-parameters-required",
        assertValidSchema("function-parameters-required", { type: "NamedParameters<typeof myFunction>" })
    );
    it(
        "function-parameters-variable-assignment",
        assertValidSchema("function-parameters-variable-assignment", { type: "NamedParameters<typeof myFunction>" })
    );
    it(
        "function-function-syntax",
        assertValidSchema("function-function-syntax", { type: "NamedParameters<typeof myFunction>" })
    );

    it("string-literals", assertValidSchema("string-literals", { type: "MyObject" }));
    it("string-literals-inline", assertValidSchema("string-literals-inline", { type: "MyObject" }));
    it("string-literals-intrinsic", assertValidSchema("string-literals-intrinsic", { type: "MyObject" }));
    it("string-literals-null", assertValidSchema("string-literals-null", { type: "MyObject" }));
    it("string-template-literals", assertValidSchema("string-template-literals", { type: "MyObject" }));
    it(
        "string-template-expression-literals",
        assertValidSchema("string-template-expression-literals", { type: "MyObject" })
    );

    it("namespace-deep-1", assertValidSchema("namespace-deep-1", { type: "RootNamespace.Def" }));
    it("namespace-deep-2", assertValidSchema("namespace-deep-2", { type: "RootNamespace.SubNamespace.HelperA" }));
    it("namespace-deep-3", assertValidSchema("namespace-deep-3", { type: "RootNamespace.SubNamespace.HelperB" }));

    it("import-simple", assertValidSchema("import-simple", { type: "MyObject" }));
    it("import-exposed", assertValidSchema("import-exposed", { type: "MyObject" }));
    it("import-internal", assertValidSchema("import-internal", { type: "MyObject", jsDoc: "basic" }));
    it("import-anonymous", assertValidSchema("import-anonymous", { type: "MyObject" }));

    it("generic-simple", assertValidSchema("generic-simple", { type: "MyObject" }));
    it("generic-arrays", assertValidSchema("generic-arrays", { type: "MyObject" }));
    it("generic-multiple", assertValidSchema("generic-multiple", { type: "MyObject" }));
    it("generic-multiargs", assertValidSchema("generic-multiargs", { type: "MyObject" }));
    it("generic-anonymous", assertValidSchema("generic-anonymous", { type: "MyObject" }));
    it("generic-recursive", assertValidSchema("generic-recursive", { type: "MyObject" }));
    it("generic-hell", assertValidSchema("generic-hell", { type: "MyObject" }));
    it("generic-default", assertValidSchema("generic-default", { type: "MyObject" }));
    it("generic-nested", assertValidSchema("generic-nested", { type: "MyObject" }));
    it("generic-prefixed-number", assertValidSchema("generic-prefixed-number", { type: "MyObject" }));
    it("generic-void", assertValidSchema("generic-void", { type: "MyObject" }));

    it("nullable-null", assertValidSchema("nullable-null", { type: "MyObject" }));

    it("undefined-alias", assertValidSchema("undefined-alias", { type: "MyType" }));
    it("undefined-union", assertValidSchema("undefined-union", { type: "MyType" }));
    it("undefined-property", assertValidSchema("undefined-property", { type: "MyType" }));

    it("never", assertValidSchema("never", { type: "BasicNever" }));
    it("never-record", assertValidSchema("never-record", { type: "Mapped" }));

    it("any-unknown", assertValidSchema("any-unknown", { type: "MyObject" }));

    it("multiple-roots1", assertValidSchema("multiple-roots1"));
    it("multiple-roots1-star", assertValidSchema("multiple-roots1", { type: "*" }));
    it("multiple-roots2", assertValidSchema("multiple-roots2/schema"));
    it("keyof-typeof-enum", assertValidSchema("keyof-typeof-enum", { type: "MyObject" }));

    it("symbol", assertValidSchema("symbol", { type: "MyObject" }));
    it("unique-symbol", assertValidSchema("unique-symbol", { type: "MyObject" }));

    it("array-min-items-1", assertValidSchema("array-min-items-1", { type: "MyType" }));
    it("array-min-items-2", assertValidSchema("array-min-items-2", { type: "MyType" }));
    it("array-min-max-items", assertValidSchema("array-min-max-items", { type: "MyType" }));
    it("array-min-max-items-optional", assertValidSchema("array-min-max-items-optional", { type: "MyType" }));
    it("array-max-items-optional", assertValidSchema("array-max-items-optional", { type: "MyType" }));
    it("shorthand-array", assertValidSchema("shorthand-array", { type: "MyType" }));
});
