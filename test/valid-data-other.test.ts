import { assertValidSchema } from "./utils";

describe("valid-data-other", () => {
    it("enums-string", assertValidSchema("enums-string", "Enum"));
    it("enums-number", assertValidSchema("enums-number", "Enum"));
    it("enums-initialized", assertValidSchema("enums-initialized", "Enum"));
    it("enums-compute", assertValidSchema("enums-compute", "Enum"));
    it("enums-mixed", assertValidSchema("enums-mixed", "Enum"));
    it("enums-member", assertValidSchema("enums-member", "MyObject"));

    it("string-literals", assertValidSchema("string-literals", "MyObject"));
    it("string-literals-inline", assertValidSchema("string-literals-inline", "MyObject"));
    it("string-literals-null", assertValidSchema("string-literals-null", "MyObject"));

    it("namespace-deep-1", assertValidSchema("namespace-deep-1", "RootNamespace.Def"));
    it("namespace-deep-2", assertValidSchema("namespace-deep-2", "RootNamespace.SubNamespace.HelperA"));
    it("namespace-deep-3", assertValidSchema("namespace-deep-3", "RootNamespace.SubNamespace.HelperB"));

    it("import-simple", assertValidSchema("import-simple", "MyObject"));
    it("import-exposed", assertValidSchema("import-exposed", "MyObject"));
    it("import-internal", assertValidSchema("import-internal", "MyObject", "basic"));
    it("import-anonymous", assertValidSchema("import-anonymous", "MyObject"));

    it("generic-simple", assertValidSchema("generic-simple", "MyObject"));
    it("generic-arrays", assertValidSchema("generic-arrays", "MyObject"));
    it("generic-multiple", assertValidSchema("generic-multiple", "MyObject"));
    it("generic-multiargs", assertValidSchema("generic-multiargs", "MyObject"));
    it("generic-anonymous", assertValidSchema("generic-anonymous", "MyObject"));
    it("generic-recursive", assertValidSchema("generic-recursive", "MyObject"));
    it("generic-hell", assertValidSchema("generic-hell", "MyObject"));
    it("generic-default", assertValidSchema("generic-default", "MyObject"));
    it("generic-nested", assertValidSchema("generic-nested", "MyObject"));
    it("generic-prefixed-number", assertValidSchema("generic-prefixed-number", "MyObject"));
    it("generic-void", assertValidSchema("generic-void", "MyObject"));

    it(
        "annotation-custom",
        assertValidSchema("annotation-custom", "MyObject", "basic", [
            "customNumberProperty",
            "customStringProperty",
            "customComplexProperty",
            "customMultilineProperty",
            "customUnquotedProperty",
        ])
    );

    it("nullable-null", assertValidSchema("nullable-null", "MyObject"));

    it("undefined-alias", assertValidSchema("undefined-alias", "MyType"));
    it("undefined-union", assertValidSchema("undefined-union", "MyType"));
    it("undefined-property", assertValidSchema("undefined-property", "MyType"));

    it("any-unknown", assertValidSchema("any-unknown", "MyObject"));

    it("multiple-roots1", assertValidSchema("multiple-roots1"));
    it("multiple-roots1-star", assertValidSchema("multiple-roots1", "*"));
    it("multiple-roots2", assertValidSchema("multiple-roots2/schema"));
    it("keyof-typeof-enum", assertValidSchema("keyof-typeof-enum", "MyObject"));

    it("symbol", assertValidSchema("symbol", "MyObject"));

    it("array-min-items-1", assertValidSchema("array-min-items-1", "MyType"));
    it("array-min-items-2", assertValidSchema("array-min-items-2", "MyType"));
});
