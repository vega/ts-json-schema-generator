import { assertValidSchema } from "./utils";

describe("valid-data-type", () => {
    it("type-aliases-primitive", assertValidSchema("type-aliases-primitive", "MyString"));
    it(
        "type-aliases-primitive-with-id",
        assertValidSchema("type-aliases-primitive-with-id", "MyString", { jsDoc: "none", schemaId: "testId" })
    );
    it("type-aliases-object", assertValidSchema("type-aliases-object", "MyAlias"));
    it("type-aliases-mixed", assertValidSchema("type-aliases-mixed", "MyObject"));
    it("type-aliases-union", assertValidSchema("type-aliases-union", "MyUnion"));
    it("type-aliases-anonymous", assertValidSchema("type-aliases-anonymous", "MyObject"));
    it("type-aliases-local-namespace", assertValidSchema("type-aliases-local-namespace", "MyObject"));
    it("type-aliases-recursive-anonymous", assertValidSchema("type-aliases-recursive-anonymous", "MyAlias"));
    it("type-aliases-recursive-export", assertValidSchema("type-aliases-recursive-export", "MyObject"));
    it(
        "type-aliases-recursive-generics-anonymous",
        assertValidSchema("type-aliases-recursive-generics-anonymous", "MyAlias")
    );
    it(
        "type-aliases-recursive-generics-export",
        assertValidSchema("type-aliases-recursive-generics-export", "MyAlias")
    );

    it("type-aliases-tuple", assertValidSchema("type-aliases-tuple", "MyTuple"));
    it("type-aliases-tuple-empty", assertValidSchema("type-aliases-tuple-empty", "MyTuple"));
    it("type-aliases-tuple-optional-items", assertValidSchema("type-aliases-tuple-optional-items", "MyTuple"));
    it("type-aliases-tuple-rest", assertValidSchema("type-aliases-tuple-rest", "MyTuple"));
    it("type-aliases-tuple-only-rest", assertValidSchema("type-aliases-tuple-only-rest", "MyTuple"));
    it("type-named-tuple-member", assertValidSchema("type-named-tuple-member", "*"));

    it("type-maps", assertValidSchema("type-maps", "MyObject"));
    it("type-primitives", assertValidSchema("type-primitives", "MyObject"));
    it("type-date", assertValidSchema("type-date", "MyObject"));
    it("type-date-annotation", assertValidSchema("type-date-annotation", "MyObject", { jsDoc: "basic" }));
    it("type-regexp", assertValidSchema("type-regexp", "MyObject"));
    it("type-uri", assertValidSchema("type-uri", "MyObject"));
    it("type-union", assertValidSchema("type-union", "TypeUnion"));
    it("type-union-tagged", assertValidSchema("type-union-tagged", "Shape"));
    it("type-intersection", assertValidSchema("type-intersection", "MyObject"));
    it("type-intersection-with-arrays", assertValidSchema("type-intersection-with-arrays", "*"));
    it("type-intersection-conflict", assertValidSchema("type-intersection-conflict", "MyObject"));
    it("type-intersection-partial-conflict", assertValidSchema("type-intersection-partial-conflict", "MyType"));
    it("type-intersection-partial-conflict-ref", assertValidSchema("type-intersection-partial-conflict", "MyType"));
    it(
        "type-intersection-partial-conflict-union",
        assertValidSchema("type-intersection-partial-conflict-union", "MyType")
    );
    it(
        "type-intersection-partial-conflict-union-alias",
        assertValidSchema("type-intersection-partial-conflict-union-alias", "MyType")
    );
    it(
        "type-intersection-recursive-interface",
        assertValidSchema("type-intersection-recursive-interface", "Intersection")
    );
    it(
        "type-intersection-union-recursive-interface",
        assertValidSchema("type-intersection-union-recursive-interface", "Intersection")
    );
    it("type-intersection-union", assertValidSchema("type-intersection-union", "MyObject"));
    it("type-intersection-union-enum", assertValidSchema("type-intersection-union-enum", "MyObject"));
    it("type-intersection-union-primitive", assertValidSchema("type-intersection-union", "MyObject"));
    it("type-intersection-aliased-union", assertValidSchema("type-intersection-aliased-union", "MyObject"));
    it("type-intersection-additional-props", assertValidSchema("type-intersection-additional-props", "MyObject"));
    it("type-extend", assertValidSchema("type-extend", "MyObject"));
    it("type-extend-circular", assertValidSchema("type-extend-circular", "MyType"));
    it("type-extends-never", assertValidSchema("type-extends-never", "MyType"));

    it("type-typeof", assertValidSchema("type-typeof", "MyType"));
    it("type-typeof-value", assertValidSchema("type-typeof-value", "MyType"));
    it("type-typeof-object-property", assertValidSchema("type-typeof-object-property", "MyType"));
    it("type-typeof-class-static-property", assertValidSchema("type-typeof-class-static-property", "MyType"));
    it("type-typeof-enum", assertValidSchema("type-typeof-enum", "MyObject"));
    it("type-typeof-class", assertValidSchema("type-typeof-class", "MyObject"));
    it("type-typeof-function", assertValidSchema("type-typeof-function", "*"));
    it("type-keys", assertValidSchema("type-typeof-keys", "MyType"));

    it("type-indexed-access-tuple-1", assertValidSchema("type-indexed-access-tuple-1", "MyType"));
    it("type-indexed-access-tuple-2", assertValidSchema("type-indexed-access-tuple-2", "MyType"));
    it("type-indexed-access-tuple-union", assertValidSchema("type-indexed-access-tuple-union", "FormLayout"));
    it("type-indexed-access-type-union", assertValidSchema("type-indexed-access-type-union", "MyType"));
    it("type-indexed-access-object-1", assertValidSchema("type-indexed-access-object-1", "MyType"));
    it("type-indexed-access-object-2", assertValidSchema("type-indexed-access-object-2", "MyType"));
    it("type-indexed-access-keyof", assertValidSchema("type-indexed-access-keyof", "MyType"));
    it("type-indexed-circular-access", assertValidSchema("type-indexed-circular-access", "*"));
    it("type-indexed-circular", assertValidSchema("type-indexed-circular", "MyType"));
    it("type-keyof-tuple", assertValidSchema("type-keyof-tuple", "MyType"));
    it("type-keyof-object", assertValidSchema("type-keyof-object", "MyType"));
    it("type-keyof-object-function", assertValidSchema("type-keyof-object-function", "MyType"));
    it("type-mapped-simple", assertValidSchema("type-mapped-simple", "MyObject"));
    it("type-mapped-index", assertValidSchema("type-mapped-index", "MyObject"));
    it("type-mapped-index-as", assertValidSchema("type-mapped-index-as", "MyObject"));
    it("type-mapped-index-as-template", assertValidSchema("type-mapped-index-as-template", "MyObject"));
    it("type-mapped-index-as-with-conditional", assertValidSchema("type-mapped-index-as-with-conditional", "MyObject"));
    it("type-mapped-literal", assertValidSchema("type-mapped-literal", "MyObject"));
    it("type-mapped-generic", assertValidSchema("type-mapped-generic", "MyObject"));
    it("type-mapped-native", assertValidSchema("type-mapped-native", "MyObject"));
    it("type-mapped-native-single-literal", assertValidSchema("type-mapped-native-single-literal", "MyObject"));
    it("type-mapped-widened", assertValidSchema("type-mapped-widened", "MyObject"));
    it("type-mapped-optional", assertValidSchema("type-mapped-optional", "MyObject"));
    it("type-mapped-additional-props", assertValidSchema("type-mapped-additional-props", "MyObject"));
    it("type-mapped-array", assertValidSchema("type-mapped-array", "MyObject"));
    it("type-mapped-union-intersection", assertValidSchema("type-mapped-union-intersection", "MyObject"));
    it("type-mapped-enum", assertValidSchema("type-mapped-enum", "MyObject"));
    it("type-mapped-enum-optional", assertValidSchema("type-mapped-enum-optional", "MyObject"));
    it("type-mapped-enum-null", assertValidSchema("type-mapped-enum-null", "MyObject"));
    it("type-mapped-enum-number", assertValidSchema("type-mapped-enum-number", "MyObject"));
    it("type-mapped-exclude", assertValidSchema("type-mapped-exclude", "MyObject"));
    it("type-mapped-double-exclude", assertValidSchema("type-mapped-double-exclude", "MyObject"));
    it("type-mapped-symbol", assertValidSchema("type-mapped-symbol", "MyObject"));
    it("type-mapped-never", assertValidSchema("type-mapped-never", "MyObject"));
    it("type-mapped-empty-exclude", assertValidSchema("type-mapped-empty-exclude", "MyObject"));
    it("type-mapped-annotated-string", assertValidSchema("type-mapped-annotated-string", "*"));

    it("type-conditional-simple", assertValidSchema("type-conditional-simple", "MyObject"));
    it("type-conditional-inheritance", assertValidSchema("type-conditional-inheritance", "MyObject"));
    it("type-conditional-union", assertValidSchema("type-conditional-union", "MyObject"));
    it("type-conditional-enum", assertValidSchema("type-conditional-enum", "IParameter"));
    it("type-conditional-intersection", assertValidSchema("type-conditional-intersection", "MyObject"));
    it("type-conditional-exclude", assertValidSchema("type-conditional-exclude", "MyObject"));
    it("type-conditional-exclude-complex", assertValidSchema("type-conditional-exclude-complex", "BaseAxisNoSignals"));
    it("type-conditional-exclude-narrowing", assertValidSchema("type-conditional-exclude-narrowing", "MyObject"));
    it("type-conditional-narrowing", assertValidSchema("type-conditional-narrowing", "MyObject"));
    it("type-conditional-omit", assertValidSchema("type-conditional-omit", "MyObject"));
    it("type-conditional-jsdoc", assertValidSchema("type-conditional-jsdoc", "MyObject"));

    it("type-conditional-infer", assertValidSchema("type-conditional-infer", "MyType"));
    it("type-conditional-infer-nested", assertValidSchema("type-conditional-infer-nested", "MyType"));
    it("type-conditional-infer-recursive", assertValidSchema("type-conditional-infer-recursive", "MyType"));
    it("type-conditional-infer-rest", assertValidSchema("type-conditional-infer-rest", "MyType"));
    it("type-conditional-infer-tail-recursion", assertValidSchema("type-conditional-infer-tail-recursion", "MyType"));
    it("type-conditional-infer-tuple-xor", assertValidSchema("type-conditional-infer-tuple-xor", "MyType"));

    it("type-tuple-nested-rest", assertValidSchema("type-tuple-nested-rest", "MyType"));
    it("type-tuple-nested-rest-to-union", assertValidSchema("type-tuple-nested-rest-to-union", "MyType"));
    it("type-tuple-nested-rest-uniform", assertValidSchema("type-tuple-nested-rest-uniform", "MyType"));

    it("type-recursive-deep-exclude", assertValidSchema("type-recursive-deep-exclude", "MyType"));
    it("type-satisfies", assertValidSchema("type-satisfies", "MyType"));

    it("ignore-export", assertValidSchema("ignore-export", "*"));

    it("lowercase", assertValidSchema("lowercase", "MyType"));
});
