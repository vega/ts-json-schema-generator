"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const annotationDefaultSamples = __importStar(require("./valid-data/annotation-default/samples"));
describe("valid-data-annotations", () => {
    it("annotation-custom", (0, utils_1.assertValidSchema)("annotation-custom", "MyObject", {
        jsDoc: "basic",
        extraTags: [
            "customBooleanProperty",
            "customNumberProperty",
            "customStringProperty",
            "customComplexProperty",
            "customMultilineProperty",
            "customUnquotedProperty",
        ],
    }));
    it("annotation-empty-basic", (0, utils_1.assertValidSchema)("annotation-empty", "MyObject", { jsDoc: "basic", extraTags: ["customEmptyAnnotation"] }));
    it("annotation-empty-extended", (0, utils_1.assertValidSchema)("annotation-empty", "MyObject", { extraTags: ["customEmptyAnnotation"] }));
    it("annotation-deprecated-basic", (0, utils_1.assertValidSchema)("annotation-deprecated", "MyObject", { jsDoc: "basic", extraTags: ["deprecationMessage"] }));
    it("annotation-deprecated-extended", (0, utils_1.assertValidSchema)("annotation-deprecated", "MyObject", { extraTags: ["deprecationMessage"] }));
    it("annotation-description-override", (0, utils_1.assertValidSchema)("annotation-description-override", "MyObject", { extraTags: ["markdownDescription"] }));
    it("annotation-comment", (0, utils_1.assertValidSchema)("annotation-comment", "MyObject"));
    it("annotation-default", function () {
        (0, utils_1.assertValidSchema)("annotation-default", "MyObject", undefined, {
            validSamples: annotationDefaultSamples.validSamples,
            invalidSamples: annotationDefaultSamples.invalidSamplesUnlessDefaults,
        })();
        const validWithDefaults = annotationDefaultSamples.invalidSamplesUnlessDefaults.map((sample) => ({
            ...sample,
        }));
        (0, utils_1.assertValidSchema)("annotation-default", "MyObject", undefined, {
            validSamples: validWithDefaults,
            ajvOptions: { useDefaults: true },
        })();
        validWithDefaults.forEach((sample) => {
            expect(sample).toEqual(annotationDefaultSamples.expectedAfterDefaults);
        });
    });
    it("annotation-example", (0, utils_1.assertValidSchema)("annotation-example", "MyObject"));
    it("annotation-id", (0, utils_1.assertValidSchema)("annotation-id", "MyObject", { schemaId: "Test" }));
    it("annotation-readOnly", (0, utils_1.assertValidSchema)("annotation-readOnly", "MyObject", { jsDoc: "basic" }));
    it("annotation-ref", (0, utils_1.assertValidSchema)("annotation-ref", "MyObject"));
    it("annotation-writeOnly", (0, utils_1.assertValidSchema)("annotation-writeOnly", "MyObject", { jsDoc: "basic" }));
    it("annotation-union-if-then", (0, utils_1.assertValidSchema)("annotation-union-if-then", "Animal", { jsDoc: "basic" }));
    it("annotation-union-if-then-enum", (0, utils_1.assertValidSchema)("annotation-union-if-then-enum", "AB", { jsDoc: "basic" }));
    it("annotation-nullable-definition", (0, utils_1.assertValidSchema)("annotation-nullable-definition", "MyObject"));
    it("discriminator", (0, utils_1.assertValidSchema)("discriminator", "Animal", { jsDoc: "basic", discriminatorType: "open-api" }));
});
//# sourceMappingURL=valid-data-annotations.test.js.map