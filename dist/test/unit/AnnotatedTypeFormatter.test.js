"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const AnnotatedTypeFormatter_1 = require("../../src/TypeFormatter/AnnotatedTypeFormatter");
describe("makeNullable", () => {
    it("makes number nullable", () => {
        const n = AnnotatedTypeFormatter_1.makeNullable({ type: "number" });
        chai_1.assert.deepEqual(n, {
            type: ["number", "null"],
        });
    });
    it("makes enum nullable", () => {
        const n = AnnotatedTypeFormatter_1.makeNullable({
            enum: ["foo"],
            type: "string",
        });
        chai_1.assert.deepEqual(n, {
            enum: ["foo", null],
            type: ["string", "null"],
        });
    });
    it("makes anyOf nullable", () => {
        const n = AnnotatedTypeFormatter_1.makeNullable({ anyOf: [{ type: "number" }, { type: "string" }] });
        chai_1.assert.deepEqual(n, { anyOf: [{ type: "number" }, { type: "string" }, { type: "null" }] });
    });
});
//# sourceMappingURL=AnnotatedTypeFormatter.test.js.map