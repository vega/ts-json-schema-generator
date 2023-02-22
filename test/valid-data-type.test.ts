import { ConstructorType } from "../src/Type/ConstructorType";
import { FunctionType } from "../src/Type/FunctionType";
import { assertMissingFormatterFor, assertValidSchema } from "./utils";

describe("valid-data-type", () => {
    it("type-aliases-primitive", assertValidSchema("type-aliases-primitive", { type: "MyString" }));
    it(
        "type-aliases-primitive-with-id",
        assertValidSchema("type-aliases-primitive-with-id", { type: "MyString", jsDoc: "none", schemaId: "testId" })
    );
    it("type-aliases-object", assertValidSchema("type-aliases-object", { type: "MyAlias" }));
    it("type-aliases-mixed", assertValidSchema("type-aliases-mixed", { type: "MyObject" }));
    it("type-aliases-union", assertValidSchema("type-aliases-union", { type: "MyUnion" }));
    it("type-aliases-anonymous", assertValidSchema("type-aliases-anonymous", { type: "MyObject" }));
    it("type-aliases-local-namespace", assertValidSchema("type-aliases-local-namespace", { type: "MyObject" }));
    it("type-aliases-recursive-anonymous", assertValidSchema("type-aliases-recursive-anonymous", { type: "MyAlias" }));
    it("type-aliases-recursive-export", assertValidSchema("type-aliases-recursive-export", { type: "MyObject" }));
    it(
        "type-aliases-recursive-generics-anonymous",
        assertValidSchema("type-aliases-recursive-generics-anonymous", { type: "MyAlias" })
    );
    it(
        "type-aliases-recursive-generics-export",
        assertValidSchema("type-aliases-recursive-generics-export", { type: "MyAlias" })
    );

    it("type-aliases-tuple", assertValidSchema("type-aliases-tuple", { type: "MyTuple" }));
    it("type-aliases-tuple-empty", assertValidSchema("type-aliases-tuple-empty", { type: "MyTuple" }));
    it(
        "type-aliases-tuple-optional-items",
        assertValidSchema("type-aliases-tuple-optional-items", { type: "MyTuple" })
    );
    it("type-aliases-tuple-rest", assertValidSchema("type-aliases-tuple-rest", { type: "MyTuple" }));
    it("type-aliases-tuple-only-rest", assertValidSchema("type-aliases-tuple-only-rest", { type: "MyTuple" }));
    it("type-named-tuple-member", assertValidSchema("type-named-tuple-member", { type: "*" }));

    it("type-maps", assertValidSchema("type-maps", { type: "MyObject" }));
    it("type-primitives", assertValidSchema("type-primitives", { type: "MyObject" }));
    it("type-date", assertValidSchema("type-date", { type: "MyObject" }));
    it("type-date-annotation", assertValidSchema("type-date-annotation", { type: "MyObject", jsDoc: "basic" }));
    it("type-regexp", assertValidSchema("type-regexp", { type: "MyObject" }));
    it("type-uri", assertValidSchema("type-uri", { type: "MyObject" }));
    it("type-union", assertValidSchema("type-union", { type: "TypeUnion" }));
    it("type-union-tagged", assertValidSchema("type-union-tagged", { type: "Shape" }));
    it("type-intersection", assertValidSchema("type-intersection", { type: "MyObject" }));
    it("type-intersection-with-arrays", assertValidSchema("type-intersection-with-arrays", { type: "*" }));
    it("type-intersection-conflict", assertValidSchema("type-intersection-conflict", { type: "MyObject" }));
    it(
        "type-intersection-partial-conflict",
        assertValidSchema("type-intersection-partial-conflict", { type: "MyType" })
    );
    it(
        "type-intersection-partial-conflict-ref",
        assertValidSchema("type-intersection-partial-conflict", { type: "MyType" })
    );
    it(
        "type-intersection-recursive-interface",
        assertValidSchema("type-intersection-recursive-interface", { type: "Intersection" })
    );
    it(
        "type-intersection-union-recursive-interface",
        assertValidSchema("type-intersection-union-recursive-interface", { type: "Intersection" })
    );
    it("type-intersection-union", assertValidSchema("type-intersection-union", { type: "MyObject" }));
    it("type-intersection-union-enum", assertValidSchema("type-intersection-union-enum", { type: "MyObject" }));
    it("type-intersection-union-primitive", assertValidSchema("type-intersection-union", { type: "MyObject" }));
    it("type-intersection-aliased-union", assertValidSchema("type-intersection-aliased-union", { type: "MyObject" }));
    it(
        "type-intersection-additional-props",
        assertValidSchema("type-intersection-additional-props", { type: "MyObject" })
    );
    it("type-extend", assertValidSchema("type-extend", { type: "MyObject" }));
    it("type-extend-circular", assertValidSchema("type-extend-circular", { type: "MyType" }));
    it("type-extends-never", assertValidSchema("type-extends-never", { type: "MyType" }));

    it("type-typeof", assertValidSchema("type-typeof", { type: "MyType" }));
    it("type-typeof-value", assertValidSchema("type-typeof-value", { type: "MyType" }));
    it("type-typeof-object-property", assertValidSchema("type-typeof-object-property", { type: "MyType" }));
    it("type-typeof-class-static-property", assertValidSchema("type-typeof-class-static-property", { type: "MyType" }));
    it("type-typeof-enum", assertValidSchema("type-typeof-enum", { type: "MyObject" }));
    it("type-typeof-class", assertValidSchema("type-typeof-class", { type: "MyObject" }));
    it("type-typeof-function", assertValidSchema("type-typeof-function", { type: "*" }));
    it("type-keys", assertValidSchema("type-typeof-keys", { type: "MyType" }));

    it("type-indexed-access-tuple-1", assertValidSchema("type-indexed-access-tuple-1", { type: "MyType" }));
    it("type-indexed-access-tuple-2", assertValidSchema("type-indexed-access-tuple-2", { type: "MyType" }));
    it("type-indexed-access-tuple-union", assertValidSchema("type-indexed-access-tuple-union", { type: "FormLayout" }));
    it("type-indexed-access-type-union", assertValidSchema("type-indexed-access-type-union", { type: "MyType" }));
    it("type-indexed-access-object-1", assertValidSchema("type-indexed-access-object-1", { type: "MyType" }));
    it("type-indexed-access-object-2", assertValidSchema("type-indexed-access-object-2", { type: "MyType" }));
    it("type-indexed-access-keyof", assertValidSchema("type-indexed-access-keyof", { type: "MyType" }));
    it(
        "type-indexed-access-method-signature",
        assertMissingFormatterFor(new FunctionType(), "type-indexed-access-method-signature", "MyType")
    );
    it("type-indexed-circular-access", assertValidSchema("type-indexed-circular-access", { type: "*" }));
    it("type-keyof-tuple", assertValidSchema("type-keyof-tuple", { type: "MyType" }));
    it("type-keyof-object", assertValidSchema("type-keyof-object", { type: "MyType" }));
    it("type-keyof-object-function", assertValidSchema("type-keyof-object-function", { type: "MyType" }));
    it("type-mapped-simple", assertValidSchema("type-mapped-simple", { type: "MyObject" }));
    it("type-mapped-index", assertValidSchema("type-mapped-index", { type: "MyObject" }));
    it("type-mapped-index-as", assertValidSchema("type-mapped-index-as", { type: "MyObject" }));
    it("type-mapped-index-as-template", assertValidSchema("type-mapped-index-as-template", { type: "MyObject" }));
    it(
        "type-mapped-index-as-with-conditional",
        assertValidSchema("type-mapped-index-as-with-conditional", { type: "MyObject" })
    );
    it("type-mapped-literal", assertValidSchema("type-mapped-literal", { type: "MyObject" }));
    it("type-mapped-generic", assertValidSchema("type-mapped-generic", { type: "MyObject" }));
    it("type-mapped-native", assertValidSchema("type-mapped-native", { type: "MyObject" }));
    it(
        "type-mapped-native-single-literal",
        assertValidSchema("type-mapped-native-single-literal", { type: "MyObject" })
    );
    it("type-mapped-widened", assertValidSchema("type-mapped-widened", { type: "MyObject" }));
    it("type-mapped-optional", assertValidSchema("type-mapped-optional", { type: "MyObject" }));
    it("type-mapped-additional-props", assertValidSchema("type-mapped-additional-props", { type: "MyObject" }));
    it("type-mapped-array", assertValidSchema("type-mapped-array", { type: "MyObject" }));
    it("type-mapped-union-intersection", assertValidSchema("type-mapped-union-intersection", { type: "MyObject" }));
    it("type-mapped-enum", assertValidSchema("type-mapped-enum", { type: "MyObject" }));
    it("type-mapped-enum-optional", assertValidSchema("type-mapped-enum-optional", { type: "MyObject" }));
    it("type-mapped-enum-null", assertValidSchema("type-mapped-enum-null", { type: "MyObject" }));
    it("type-mapped-enum-number", assertValidSchema("type-mapped-enum-number", { type: "MyObject" }));
    it("type-mapped-exclude", assertValidSchema("type-mapped-exclude", { type: "MyObject" }));
    it("type-mapped-double-exclude", assertValidSchema("type-mapped-double-exclude", { type: "MyObject" }));
    it("type-mapped-symbol", assertValidSchema("type-mapped-symbol", { type: "MyObject" }));
    it("type-mapped-never", assertValidSchema("type-mapped-never", { type: "MyObject" }));
    it("type-mapped-empty-exclude", assertValidSchema("type-mapped-empty-exclude", { type: "MyObject" }));
    it("type-mapped-annotated-string", assertValidSchema("type-mapped-annotated-string", { type: "*" }));

    it("type-conditional-simple", assertValidSchema("type-conditional-simple", { type: "MyObject" }));
    it("type-conditional-inheritance", assertValidSchema("type-conditional-inheritance", { type: "MyObject" }));
    it("type-conditional-union", assertValidSchema("type-conditional-union", { type: "MyObject" }));
    it("type-conditional-enum", assertValidSchema("type-conditional-enum", { type: "IParameter" }));
    it("type-conditional-intersection", assertValidSchema("type-conditional-intersection", { type: "MyObject" }));
    it("type-conditional-exclude", assertValidSchema("type-conditional-exclude", { type: "MyObject" }));
    it(
        "type-conditional-exclude-complex",
        assertValidSchema("type-conditional-exclude-complex", { type: "BaseAxisNoSignals" })
    );
    it(
        "type-conditional-exclude-narrowing",
        assertValidSchema("type-conditional-exclude-narrowing", { type: "MyObject" })
    );
    it("type-conditional-narrowing", assertValidSchema("type-conditional-narrowing", { type: "MyObject" }));
    it("type-conditional-omit", assertValidSchema("type-conditional-omit", { type: "MyObject" }));
    it("type-conditional-jsdoc", assertValidSchema("type-conditional-jsdoc", { type: "MyObject" }));

    it("type-conditional-infer", assertValidSchema("type-conditional-infer", { type: "MyType" }));
    it("type-conditional-infer-nested", assertValidSchema("type-conditional-infer-nested", { type: "MyType" }));
    it("type-conditional-infer-recursive", assertValidSchema("type-conditional-infer-recursive", { type: "MyType" }));
    it("type-conditional-infer-rest", assertValidSchema("type-conditional-infer-rest", { type: "MyType" }));
    it(
        "type-conditional-infer-tail-recursion",
        assertValidSchema("type-conditional-infer-tail-recursion", { type: "MyType" })
    );
    it("type-conditional-infer-tuple-xor", assertValidSchema("type-conditional-infer-tuple-xor", { type: "MyType" }));

    it("type-constructor", assertMissingFormatterFor(new ConstructorType(), "type-constructor", "MyType"));

    it("type-tuple-nested-rest", assertValidSchema("type-tuple-nested-rest", { type: "MyType" }));
    it("type-tuple-nested-rest-to-union", assertValidSchema("type-tuple-nested-rest-to-union", { type: "MyType" }));
    it("type-tuple-nested-rest-uniform", assertValidSchema("type-tuple-nested-rest-uniform", { type: "MyType" }));

    it("type-recursive-deep-exclude", assertValidSchema("type-recursive-deep-exclude", { type: "MyType" }));
    it("ignore-export", assertValidSchema("ignore-export", { type: "*" }));
});
