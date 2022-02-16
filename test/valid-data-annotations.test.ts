import { assertValidSchema } from "./utils";

describe("valid-data-annotations", () => {
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

    it("annotation-empty-basic", assertValidSchema("annotation-empty", "MyObject", "basic", ["customEmptyAnnotation"]));
    it(
        "annotation-empty-extended",
        assertValidSchema("annotation-empty", "MyObject", "extended", ["customEmptyAnnotation"])
    );
    it(
        "annotation-deprecated-empty-basic",
        assertValidSchema("annotation-deprecated-empty", "MyObject", "basic", ["customEmptyAnnotation"])
    );
    it(
        "annotation-deprecated-empty-extended",
        assertValidSchema("annotation-deprecated-empty", "MyObject", "extended", ["customEmptyAnnotation"])
    );

    it("annotation-comment", assertValidSchema("annotation-comment", "MyObject", "extended"));

    it("annotation-id", assertValidSchema("annotation-id", "MyObject", "extended", [], "Test"));
});
