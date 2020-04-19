import { assertValidSchema } from "./utils";

describe("valid-data-struct", () => {
    // TODO: generics recursive
    it("simple-object", assertValidSchema("simple-object", "SimpleObject"));

    it("object-literal-expression", assertValidSchema("object-literal-expression", "MyType"));

    it("literal-object-type", assertValidSchema("literal-object-type", "MyType"));
    it("literal-array-type", assertValidSchema("literal-array-type", "MyType"));
    it("literal-index-type", assertValidSchema("literal-index-type", "MyType"));

    it("interface-single", assertValidSchema("interface-single", "MyObject"));
    it("interface-multi", assertValidSchema("interface-multi", "MyObject"));
    it("interface-recursion", assertValidSchema("interface-recursion", "MyObject"));
    it("interface-extra-props", assertValidSchema("interface-extra-props", "MyObject"));
    it("interface-extended-extra-props", assertValidSchema("interface-extended-extra-props", "MyObject"));
    it("interface-array", assertValidSchema("interface-array", "TagArray"));
    it("interface-property-dash", assertValidSchema("interface-property-dash", "MyObject"));

    it("class-single", assertValidSchema("class-single", "MyObject"));
    it("class-multi", assertValidSchema("class-multi", "MyObject"));
    it("class-recursion", assertValidSchema("class-recursion", "MyObject"));
    it("class-extra-props", assertValidSchema("class-extra-props", "MyObject"));
    it("class-inheritance", assertValidSchema("class-inheritance", "MyObject"));
    it("class-generics", assertValidSchema("class-generics", "MyObject"));
    it("class-jsdoc", assertValidSchema("class-jsdoc", "MyObject", "extended"));

    it("structure-private", assertValidSchema("structure-private", "MyObject"));
    it("structure-anonymous", assertValidSchema("structure-anonymous", "MyObject"));
    it("structure-recursion", assertValidSchema("structure-recursion", "MyObject"));
    it("structure-extra-props", assertValidSchema("structure-extra-props", "MyObject"));
});
