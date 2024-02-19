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
const objectRequiredSamples = __importStar(require("./valid-data/object-required/samples"));
describe("valid-data-other", () => {
    it("enums-string", (0, utils_1.assertValidSchema)("enums-string", "Enum"));
    it("enums-number", (0, utils_1.assertValidSchema)("enums-number", "Enum"));
    it("enums-initialized", (0, utils_1.assertValidSchema)("enums-initialized", "Enum"));
    it("enums-compute", (0, utils_1.assertValidSchema)("enums-compute", "Enum"));
    it("enums-mixed", (0, utils_1.assertValidSchema)("enums-mixed", "Enum"));
    it("enums-member", (0, utils_1.assertValidSchema)("enums-member", "MyObject"));
    it("enums-template-literal", (0, utils_1.assertValidSchema)("enums-template-literal", "MyObject"));
    it("function-parameters-default-value", (0, utils_1.assertValidSchema)("function-parameters-default-value", "NamedParameters<typeof myFunction>"));
    it("function-parameters-declaration", (0, utils_1.assertValidSchema)("function-parameters-declaration", "NamedParameters<typeof myFunction>"));
    it("function-parameters-jsdoc", (0, utils_1.assertValidSchema)("function-parameters-jsdoc", "NamedParameters<typeof myFunction>", { jsDoc: "basic" }));
    it("function-parameters-optional", (0, utils_1.assertValidSchema)("function-parameters-optional", "NamedParameters<typeof myFunction>"));
    it("function-parameters-required", (0, utils_1.assertValidSchema)("function-parameters-required", "NamedParameters<typeof myFunction>"));
    it("function-parameters-variable-assignment", (0, utils_1.assertValidSchema)("function-parameters-variable-assignment", "NamedParameters<typeof myFunction>"));
    it("function-function-syntax", (0, utils_1.assertValidSchema)("function-function-syntax", "NamedParameters<typeof myFunction>"));
    it("string-literals", (0, utils_1.assertValidSchema)("string-literals", "MyObject"));
    it("string-literals-inline", (0, utils_1.assertValidSchema)("string-literals-inline", "MyObject"));
    it("string-literals-intrinsic", (0, utils_1.assertValidSchema)("string-literals-intrinsic", "MyObject"));
    it("string-literals-null", (0, utils_1.assertValidSchema)("string-literals-null", "MyObject"));
    it("string-template-literals", (0, utils_1.assertValidSchema)("string-template-literals", "MyObject"));
    it("string-template-expression-literals", (0, utils_1.assertValidSchema)("string-template-expression-literals", "MyObject"));
    it("string-template-expression-literals-import", (0, utils_1.assertValidSchema)("string-template-expression-literals-import", "MyObject"));
    it("namespace-deep-1", (0, utils_1.assertValidSchema)("namespace-deep-1", "RootNamespace.Def"));
    it("namespace-deep-2", (0, utils_1.assertValidSchema)("namespace-deep-2", "RootNamespace.SubNamespace.HelperA"));
    it("namespace-deep-3", (0, utils_1.assertValidSchema)("namespace-deep-3", "RootNamespace.SubNamespace.HelperB"));
    it("import-simple", (0, utils_1.assertValidSchema)("import-simple", "MyObject"));
    it("import-exposed", (0, utils_1.assertValidSchema)("import-exposed", "MyObject"));
    it("import-internal", (0, utils_1.assertValidSchema)("import-internal", "MyObject", { jsDoc: "basic" }));
    it("import-anonymous", (0, utils_1.assertValidSchema)("import-anonymous", "MyObject"));
    it("generic-simple", (0, utils_1.assertValidSchema)("generic-simple", "MyObject"));
    it("generic-arrays", (0, utils_1.assertValidSchema)("generic-arrays", "MyObject"));
    it("generic-multiple", (0, utils_1.assertValidSchema)("generic-multiple", "MyObject"));
    it("generic-multiargs", (0, utils_1.assertValidSchema)("generic-multiargs", "MyObject"));
    it("generic-anonymous", (0, utils_1.assertValidSchema)("generic-anonymous", "MyObject"));
    it("generic-recursive", (0, utils_1.assertValidSchema)("generic-recursive", "MyObject"));
    it("generic-hell", (0, utils_1.assertValidSchema)("generic-hell", "MyObject"));
    it("generic-default-conditional", (0, utils_1.assertValidSchema)("generic-default-conditional", "MyObject"));
    it("generic-default", (0, utils_1.assertValidSchema)("generic-default", "MyObject"));
    it("generic-nested", (0, utils_1.assertValidSchema)("generic-nested", "MyObject"));
    it("generic-prefixed-number", (0, utils_1.assertValidSchema)("generic-prefixed-number", "MyObject"));
    it("generic-void", (0, utils_1.assertValidSchema)("generic-void", "MyObject"));
    it("nullable-null", (0, utils_1.assertValidSchema)("nullable-null", "MyObject"));
    it("undefined-alias", (0, utils_1.assertValidSchema)("undefined-alias", "MyType"));
    it("undefined-union", (0, utils_1.assertValidSchema)("undefined-union", "MyType"));
    it("undefined-property", (0, utils_1.assertValidSchema)("undefined-property", "MyType"));
    it("never", (0, utils_1.assertValidSchema)("never", "BasicNever"));
    it("never-record", (0, utils_1.assertValidSchema)("never-record", "Mapped"));
    it("any-unknown", (0, utils_1.assertValidSchema)("any-unknown", "MyObject"));
    it("multiple-roots1", (0, utils_1.assertValidSchema)("multiple-roots1"));
    it("multiple-roots1-star", (0, utils_1.assertValidSchema)("multiple-roots1", "*"));
    it("multiple-roots2", (0, utils_1.assertValidSchema)("multiple-roots2/schema"));
    it("keyof-typeof-enum", (0, utils_1.assertValidSchema)("keyof-typeof-enum", "MyObject"));
    it("symbol", (0, utils_1.assertValidSchema)("symbol", "MyObject"));
    it("unique-symbol", (0, utils_1.assertValidSchema)("unique-symbol", "MyObject"));
    it("array-min-items-1", (0, utils_1.assertValidSchema)("array-min-items-1", "MyType"));
    it("array-min-items-2", (0, utils_1.assertValidSchema)("array-min-items-2", "MyType"));
    it("array-min-max-items", (0, utils_1.assertValidSchema)("array-min-max-items", "MyType"));
    it("array-min-max-items-optional", (0, utils_1.assertValidSchema)("array-min-max-items-optional", "MyType"));
    it("array-max-items-optional", (0, utils_1.assertValidSchema)("array-max-items-optional", "MyType"));
    it("shorthand-array", (0, utils_1.assertValidSchema)("shorthand-array", "MyType"));
    it("object-required", (0, utils_1.assertValidSchema)("object-required", "MyObject", undefined, {
        ...objectRequiredSamples,
        ajvOptions: { $data: true },
    }));
});
//# sourceMappingURL=valid-data-other.test.js.map