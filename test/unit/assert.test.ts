import { LogicError } from "../../src/Error/LogicError.js";
import assert from "../../src/Utils/assert.js";

describe("validate assert", () => {
    it.each`
        value
        ${"hello"}
        ${1}
        ${true}
        ${{}}
    `("success $value", ({ value }) => {
        expect(() => assert(value, "message")).not.toThrow();
    });

    it.each`
        value
        ${""}
        ${0}
        ${false}
        ${undefined}
        ${null}
    `("fail $value", ({ value }) => {
        expect(() => assert(value, "failed to be true")).toThrowError(LogicError);
    });
});
