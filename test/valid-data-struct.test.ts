import { assertValidSchema } from "./utils";

describe("valid-data-struct", () => {
    // TODO: generics recursive
    it("simple-object", assertValidSchema("simple-object", { type: "SimpleObject" }));

    it("object-function-expression", assertValidSchema("object-function-expression", { type: "MyType" }));
    it("object-literal-expression", assertValidSchema("object-literal-expression", { type: "MyType" }));

    it("literal-object-type", assertValidSchema("literal-object-type", { type: "MyType" }));
    it(
        "literal-object-type-with-computed-props",
        assertValidSchema("literal-object-type-with-computed-props", { type: "MyType" })
    );
    it("literal-array-type", assertValidSchema("literal-array-type", { type: "MyType" }));
    it("literal-index-type", assertValidSchema("literal-index-type", { type: "MyType" }));

    it("interface-single", assertValidSchema("interface-single", { type: "MyObject" }));
    it("interface-multi", assertValidSchema("interface-multi", { type: "MyObject" }));
    it("interface-recursion", assertValidSchema("interface-recursion", { type: "MyObject" }));
    it("interface-extra-props", assertValidSchema("interface-extra-props", { type: "MyObject" }));
    it("interface-extended-extra-props", assertValidSchema("interface-extended-extra-props", { type: "MyObject" }));
    it("interface-array", assertValidSchema("interface-array", { type: "TagArray" }));
    it("interface-property-dash", assertValidSchema("interface-property-dash", { type: "MyObject" }));
    it("interface-computed-property-name", assertValidSchema("interface-computed-property-name", { type: "MyObject" }));

    it("class-single", assertValidSchema("class-single", { type: "MyObject" }));
    it("class-multi", assertValidSchema("class-multi", { type: "MyObject" }));
    it("class-recursion", assertValidSchema("class-recursion", { type: "MyObject" }));
    it("class-extra-props", assertValidSchema("class-extra-props", { type: "MyObject" }));
    it("class-inheritance", assertValidSchema("class-inheritance", { type: "MyObject" }));
    it("class-generics", assertValidSchema("class-generics", { type: "MyObject" }));
    it("class-jsdoc", assertValidSchema("class-jsdoc", { type: "MyObject" }));

    it("structure-private", assertValidSchema("structure-private", { type: "MyObject" }));
    it("structure-anonymous", assertValidSchema("structure-anonymous", { type: "MyObject" }));
    it("structure-recursion", assertValidSchema("structure-recursion", { type: "MyObject" }));
    it("structure-extra-props", assertValidSchema("structure-extra-props", { type: "MyObject" }));
});
