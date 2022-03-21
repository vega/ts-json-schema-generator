import { assertValidSchema } from "./utils";

describe("valid-data-annotations", () => {
    it(
        "annotation-custom",
        assertValidSchema("annotation-custom", "MyObject", "basic", [
            "customBooleanProperty",
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
        "annotation-deprecated-basic",
        assertValidSchema("annotation-deprecated", "MyObject", "basic", ["deprecationMessage"])
    );
    it(
        "annotation-deprecated-extended",
        assertValidSchema("annotation-deprecated", "MyObject", "extended", ["deprecationMessage"])
    );

    it("annotation-comment", assertValidSchema("annotation-comment", "MyObject", "extended"));

    it("annotation-id", assertValidSchema("annotation-id", "MyObject", "extended", [], "Test"));

    it("annotation-readOnly", assertValidSchema("annotation-readOnly", "MyObject", "basic"));

    it("annotation-writeOnly", assertValidSchema("annotation-writeOnly", "MyObject", "basic"));
});
