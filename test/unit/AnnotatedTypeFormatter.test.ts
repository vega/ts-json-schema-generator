import { assert } from "chai";
import { makeNullable } from "../../src/TypeFormatter/AnnotatedTypeFormatter";

describe("makeNullable", () => {
    it("makes number nullable", () => {
        const n = makeNullable({type: "number"});
        assert.deepEqual(n, {
            type: ["number", "null"],
        });
    });

    it("makes enum nullable", () => {
        const n = makeNullable({
            enum: ["foo"],
            type: "string",
        });
        assert.deepEqual(n, {
            enum: ["foo", null],
            type: ["string", "null"],
        });
    });

    it("makes anyOf nullable", () => {
        const n = makeNullable({anyOf: [{type: "number"}, {type: "string"}]});
        assert.deepEqual(n, {anyOf: [{type: "number"}, {type: "string"}, {type: "null"}]});
    });
});
