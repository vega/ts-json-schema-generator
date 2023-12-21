import { assertValidSchema } from "./utils";
import * as annotationDefaultSamples from "./valid-data/annotation-default/samples";

describe("valid-data-annotations", () => {
    it(
        "annotation-custom",
        assertValidSchema("annotation-custom", "MyObject", {
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
        assertValidSchema("annotation-empty", "MyObject", { jsDoc: "basic", extraTags: ["customEmptyAnnotation"] })
    );
    it(
        "annotation-empty-extended",
        assertValidSchema("annotation-empty", "MyObject", { extraTags: ["customEmptyAnnotation"] })
    );
    it(
        "annotation-deprecated-basic",
        assertValidSchema("annotation-deprecated", "MyObject", { jsDoc: "basic", extraTags: ["deprecationMessage"] })
    );
    it(
        "annotation-deprecated-extended",
        assertValidSchema("annotation-deprecated", "MyObject", { extraTags: ["deprecationMessage"] })
    );
    it(
        "annotation-description-override",
        assertValidSchema("annotation-description-override", "MyObject", { extraTags: ["markdownDescription"] })
    );

    it("annotation-comment", assertValidSchema("annotation-comment", "MyObject"));

    it("annotation-default", function () {
        // Without actually using the defaults.
        assertValidSchema("annotation-default", "MyObject", undefined, {
            validSamples: annotationDefaultSamples.validSamples,
            invalidSamples: annotationDefaultSamples.invalidSamplesUnlessDefaults,
        })();

        // Having AJV use the defaults.

        // Since AJV will mutate, make
        // shallow copies.
        const validWithDefaults = annotationDefaultSamples.invalidSamplesUnlessDefaults.map((sample) => ({
            ...sample,
        }));

        assertValidSchema("annotation-default", "MyObject", undefined, {
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

    it("annotation-example", assertValidSchema("annotation-example", "MyObject"));

    it("annotation-id", assertValidSchema("annotation-id", "MyObject", { schemaId: "Test" }));

    it("annotation-readOnly", assertValidSchema("annotation-readOnly", "MyObject", { jsDoc: "basic" }));

    it("annotation-ref", assertValidSchema("annotation-ref", "MyObject"));

    it("annotation-writeOnly", assertValidSchema("annotation-writeOnly", "MyObject", { jsDoc: "basic" }));

    it("annotation-union-if-then", assertValidSchema("annotation-union-if-then", "Animal", { jsDoc: "basic" }));

    it("annotation-union-if-then-enum", assertValidSchema("annotation-union-if-then-enum", "AB", { jsDoc: "basic" }));

    it("annotation-nullable-definition", assertValidSchema("annotation-nullable-definition", "MyObject"));

    it("discriminator", assertValidSchema("discriminator", "*", { jsDoc: "basic", discriminatorType: "open-api" }));
});
