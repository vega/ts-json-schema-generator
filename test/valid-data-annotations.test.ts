import { assertValidSchema } from "./utils";
import * as annotationDefaultSamples from "./valid-data/annotation-default/samples";

describe("valid-data-annotations", () => {
    it(
        "annotation-custom",
        assertValidSchema("annotation-custom", {
            type: "MyObject",
            jsDoc: "basic",
            extraTags: [
                "customBooleanProperty",
                "customNumberProperty",
                "customStringProperty",
                "customComplexProperty",
                "customMultilineProperty",
                "customUnquotedProperty",
            ],
        })
    );

    it(
        "annotation-empty-basic",
        assertValidSchema("annotation-empty", {
            type: "MyObject",
            jsDoc: "basic",
            extraTags: ["customEmptyAnnotation"],
        })
    );
    it(
        "annotation-empty-extended",
        assertValidSchema("annotation-empty", {
            type: "MyObject",
            extraTags: ["customEmptyAnnotation"],
        })
    );
    it(
        "annotation-deprecated-basic",
        assertValidSchema("annotation-deprecated", {
            type: "MyObject",
            jsDoc: "basic",
            extraTags: ["deprecationMessage"],
        })
    );
    it(
        "annotation-deprecated-extended",
        assertValidSchema("annotation-deprecated", {
            type: "MyObject",
            extraTags: ["deprecationMessage"],
        })
    );
    it(
        "annotation-description-override",
        assertValidSchema("annotation-description-override", {
            type: "MyObject",
            jsDoc: "extended",
            extraTags: ["markdownDescription"],
        })
    );

    it("annotation-comment", assertValidSchema("annotation-comment", { type: "MyObject" }));

    it("annotation-default", function () {
        // Without actually using the defaults.
        assertValidSchema(
            "annotation-default",
            { type: "MyObject" },
            {
                validSamples: annotationDefaultSamples.validSamples,
                invalidSamples: annotationDefaultSamples.invalidSamplesUnlessDefaults,
            }
        )();

        // Having AJV use the defaults.

        // Since AJV will mutate, make
        // shallow copies.
        const validWithDefaults = annotationDefaultSamples.invalidSamplesUnlessDefaults.map((sample) => ({
            ...sample,
        }));

        assertValidSchema(
            "annotation-default",
            { type: "MyObject" },
            {
                validSamples: validWithDefaults,
                ajvOptions: { useDefaults: true },
            }
        )();

        // The previously-invalid samples
        // should now match the expected
        // structure when all defaults are applied.
        validWithDefaults.forEach((sample) => {
            expect(sample).toEqual(annotationDefaultSamples.expectedAfterDefaults);
        });
    });

    it("annotation-example", assertValidSchema("annotation-example", { type: "MyObject" }));

    it("annotation-id", assertValidSchema("annotation-id", { type: "MyObject", schemaId: "Test" }));

    it("annotation-readOnly", assertValidSchema("annotation-readOnly", { type: "MyObject", jsDoc: "basic" }));

    it("annotation-ref", assertValidSchema("annotation-ref", { type: "MyObject" }));

    it("annotation-writeOnly", assertValidSchema("annotation-writeOnly", { type: "MyObject", jsDoc: "basic" }));

    it("annotation-union-if-then", assertValidSchema("annotation-union-if-then", { type: "Animal", jsDoc: "basic" }));

    it("annotation-nullable-definition", assertValidSchema("annotation-nullable-definition", { type: "MyObject" }));

    it("discriminator", assertValidSchema("discriminator", { type: "Animal", discriminatorType: "open-api" }));
});
