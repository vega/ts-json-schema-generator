import { assertValidSchema } from "./utils";
import * as annotationDefaultSamples from "./valid-data/annotation-default/samples";

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
    it(
        "annotation-description-override",
        assertValidSchema("annotation-description-override", "MyObject", "extended", ["markdownDescription"])
    );

    it("annotation-comment", assertValidSchema("annotation-comment", "MyObject", "extended"));

    it("annotation-default", function () {
        // Without actually using the defaults.
        assertValidSchema("annotation-default", "MyObject", "extended", [], undefined, {
            validSamples: annotationDefaultSamples.validSamples,
            invalidSamples: annotationDefaultSamples.invalidSamplesUnlessDefaults,
        })();

        // Having AJV use the defaults.

        // Since AJV will mutate, make
        // shallow copies.
        const validWithDefaults = annotationDefaultSamples.invalidSamplesUnlessDefaults.map((sample) => ({
            ...sample,
        }));

        assertValidSchema("annotation-default", "MyObject", "extended", [], undefined, {
            validSamples: validWithDefaults,
            ajvOptions: { useDefaults: true },
        })();

        // The previously-invalid samples
        // should now match the expected
        // structure when all defaults are applied.
        validWithDefaults.forEach((sample) => {
            expect(sample).toEqual(annotationDefaultSamples.expectedAfterDefaults);
        });
    });

    it("annotation-example", assertValidSchema("annotation-example", "MyObject", "extended"));

    it("annotation-id", assertValidSchema("annotation-id", "MyObject", "extended", [], "Test"));

    it("annotation-readOnly", assertValidSchema("annotation-readOnly", "MyObject", "basic"));

    it("annotation-ref", assertValidSchema("annotation-ref", "MyObject", "extended"));

    it("annotation-writeOnly", assertValidSchema("annotation-writeOnly", "MyObject", "basic"));

    it("annotation-union-if-then", assertValidSchema("annotation-union-if-then", "Animal", "basic"));

    it("annotation-nullable-definition", assertValidSchema("annotation-nullable-definition", "MyObject", "extended"));
});
