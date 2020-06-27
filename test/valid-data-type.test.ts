import { assertValidSchema } from "./utils";

describe("valid-data-type", () => {
    it("type-aliases-primitive", assertValidSchema("type-aliases-primitive", "MyString"));
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

    it("type-maps", assertValidSchema("type-maps", "MyObject"));
    it("type-primitives", assertValidSchema("type-primitives", "MyObject"));
    it("type-union", assertValidSchema("type-union", "TypeUnion"));
    it("type-union-tagged", assertValidSchema("type-union-tagged", "Shape"));
    it("type-intersection", assertValidSchema("type-intersection", "MyObject"));
    it("type-intersection-conflict", assertValidSchema("type-intersection-conflict", "MyObject"));
    it("type-intersection-partial-conflict", assertValidSchema("type-intersection-partial-conflict", "MyType"));
    it("type-intersection-partial-conflict-ref", assertValidSchema("type-intersection-partial-conflict", "MyType"));
    it("type-intersection-union", assertValidSchema("type-intersection-union", "MyObject"));
    it("type-intersection-union-primitive", assertValidSchema("type-intersection-union", "MyObject"));
    it("type-intersection-additional-props", assertValidSchema("type-intersection-additional-props", "MyObject"));
    it("type-extend", assertValidSchema("type-extend", "MyObject"));
    it("type-extend-circular", assertValidSchema("type-extend-circular", "MyType"));

    it("type-typeof", assertValidSchema("type-typeof", "MyType"));
    it("type-typeof-value", assertValidSchema("type-typeof-value", "MyType"));
    it("type-typeof-enum", assertValidSchema("type-typeof-enum", "MyObject"));
    it("type-typeof-class", assertValidSchema("type-typeof-class", "MyObject"));

    it("type-indexed-access-tuple-1", assertValidSchema("type-indexed-access-tuple-1", "MyType"));
    it("type-indexed-access-tuple-2", assertValidSchema("type-indexed-access-tuple-2", "MyType"));
    it("type-indexed-access-tuple-union", assertValidSchema("type-indexed-access-tuple-union", "FormLayout"));
    it("type-indexed-access-type-union", assertValidSchema("type-indexed-access-type-union", "MyType"));
    it("type-indexed-access-object-1", assertValidSchema("type-indexed-access-object-1", "MyType"));
    it("type-indexed-access-object-2", assertValidSchema("type-indexed-access-object-2", "MyType"));
    it("type-indexed-access-keyof", assertValidSchema("type-indexed-access-keyof", "MyType"));
    it("type-keyof-tuple", assertValidSchema("type-keyof-tuple", "MyType"));
    it("type-keyof-object", assertValidSchema("type-keyof-object", "MyType"));
    it("type-keyof-object-function", assertValidSchema("type-keyof-object-function", "MyType"));
    it("type-mapped-simple", assertValidSchema("type-mapped-simple", "MyObject"));
    it("type-mapped-index", assertValidSchema("type-mapped-index", "MyObject"));
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
    it("type-mapped-exclude", assertValidSchema("type-mapped-exclude", "MyObject", "extended"));
    it("type-mapped-double-exclude", assertValidSchema("type-mapped-double-exclude", "MyObject", "extended"));

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
    it("type-conditional-jsdoc", assertValidSchema("type-conditional-jsdoc", "MyObject", "extended"));
});
