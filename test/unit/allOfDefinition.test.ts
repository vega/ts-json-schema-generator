import assert from "node:assert";
import { describe, it } from "node:test";
import type { BaseType } from "../../src/Type/BaseType.js";
import type { TypeFormatter } from "../../src/TypeFormatter.js";
import { getAllOfDefinitionReducer } from "../../src/Utils/allOfDefinition.js";

describe("getAllOfDefinitionReducer - additionalProperties fix", () => {
    it("does not delete additionalProperties: false when other has additionalProperties undefined", () => {
        const mockFormatter: TypeFormatter = {
            getDefinition: () => ({
                type: "object",
                properties: {},
                // no additionalProperties key (undefined) - e.g. from [key: string]: any
            }),
            getChildren: () => [],
        };

        const reduce = getAllOfDefinitionReducer(mockFormatter);
        const definition = {
            type: "object" as const,
            properties: { name: { type: "string" as const } },
            required: ["name"],
            additionalProperties: false,
        };
        const baseType = {} as BaseType;
        const result = reduce(definition, baseType);

        assert.strictEqual(
            result.additionalProperties,
            false,
            "Must keep additionalProperties: false when other has undefined",
        );
    });

    it("deletes additionalProperties when other explicitly has additionalProperties: true", () => {
        const mockFormatter: TypeFormatter = {
            getDefinition: () => ({
                type: "object",
                properties: {},
                additionalProperties: true,
            }),
            getChildren: () => [],
        };

        const reduce = getAllOfDefinitionReducer(mockFormatter);
        const definition = {
            type: "object" as const,
            properties: { name: { type: "string" as const } },
            required: ["name"],
            additionalProperties: false,
        };
        const baseType = {} as BaseType;
        const result = reduce(definition, baseType);

        assert.strictEqual(
            result.additionalProperties,
            undefined,
            "Must remove additionalProperties when other explicitly allows (true)",
        );
    });
});
