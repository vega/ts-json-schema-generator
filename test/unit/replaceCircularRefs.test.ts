import assert from "node:assert";
import { describe, it } from "node:test";
import type { Definition } from "../../src/Schema/Definition.js";
import { buildNameMaps, deepCloneDefinition, replaceCircularRefs } from "../../src/Utils/replaceCircularRefs.js";

describe("replaceCircularRefs", () => {
    it("replaces circular references between two definitions with $ref", () => {
        const defA: Definition = { type: "object", properties: {} };
        const defB: Definition = { type: "object", properties: {} };
        (defA.properties as Record<string, unknown>).child = defB;
        (defB.properties as Record<string, unknown>).parent = defA;

        const definitions: Record<string, Definition> = { A: defA, B: defB };
        replaceCircularRefs(definitions);

        assert.doesNotThrow(() => JSON.stringify(definitions));
        const bProps = defB.properties as Record<string, unknown>;
        assert.ok(bProps.parent && typeof bProps.parent === "object" && "$ref" in bProps.parent);
        assert.strictEqual((bProps.parent as { $ref: string }).$ref, "#/definitions/A");
    });

    it("replaces self-reference in a definition with $ref", () => {
        const def: Definition = { type: "object", properties: {} };
        (def.properties as Record<string, unknown>).self = def;

        const definitions: Record<string, Definition> = { Self: def };
        replaceCircularRefs(definitions);

        assert.doesNotThrow(() => JSON.stringify(definitions));
        const selfRef = (def.properties as Record<string, unknown>).self as { $ref?: string };
        assert.strictEqual(selfRef?.$ref, "#/definitions/Self");
    });

    it("updates rootDefs in-place when they participate in cycles", () => {
        const defInDict: Definition = { type: "object", properties: {} };
        const rootDef: Definition = { type: "object", properties: {} };
        (defInDict.properties as Record<string, unknown>).root = rootDef;
        (rootDef.properties as Record<string, unknown>).back = defInDict;

        const definitions: Record<string, Definition> = { InDict: defInDict };
        replaceCircularRefs(definitions, [rootDef]);

        assert.doesNotThrow(() => JSON.stringify(definitions));
        assert.doesNotThrow(() => JSON.stringify(rootDef));
        const backRef = (rootDef.properties as Record<string, unknown>).back as { $ref?: string };
        assert.strictEqual(backRef?.$ref, "#/definitions/InDict");
    });
});

describe("buildNameMaps", () => {
    it("maps definition objects and their anyOf/oneOf arrays to names", () => {
        const anyOfArr = [{ type: "string" as const }, { type: "number" as const }];
        const defWithAnyOf: Definition = { anyOf: anyOfArr };
        const oneOfArr = [{ type: "boolean" as const }];
        const defWithOneOf: Definition = { oneOf: oneOfArr };
        const defPlain: Definition = { type: "object" };

        const definitions: Record<string, Definition> = {
            WithAnyOf: defWithAnyOf,
            WithOneOf: defWithOneOf,
            Plain: defPlain,
        };
        const { objToName, arrayToName } = buildNameMaps(definitions);

        assert.strictEqual(objToName.get(defWithAnyOf), "WithAnyOf");
        assert.strictEqual(objToName.get(defWithOneOf), "WithOneOf");
        assert.strictEqual(objToName.get(defPlain), "Plain");
        assert.strictEqual(arrayToName.get(anyOfArr), "WithAnyOf");
        assert.strictEqual(arrayToName.get(oneOfArr), "WithOneOf");
        assert.strictEqual(objToName.size, 3);
        assert.strictEqual(arrayToName.size, 2);
    });
});

describe("deepCloneDefinition", () => {
    it("produces acyclic clone with $ref for circular references", () => {
        const defA: Definition = { type: "object", properties: {} };
        const defB: Definition = { type: "object", properties: {} };
        (defA.properties as Record<string, unknown>).link = defB;
        (defB.properties as Record<string, unknown>).link = defA;

        const definitions: Record<string, Definition> = { A: defA, B: defB };
        const { objToName, arrayToName } = buildNameMaps(definitions);

        const clone = deepCloneDefinition(defA, objToName, arrayToName);

        assert.doesNotThrow(() => JSON.stringify(clone));
        assert.notStrictEqual(clone, defA);
        const cloneProps = (clone as { properties?: Record<string, unknown> }).properties;
        assert.ok(cloneProps);
        const inner = cloneProps?.link as { properties?: Record<string, unknown> };
        assert.ok(inner?.properties?.link && typeof inner.properties.link === "object");
        assert.strictEqual((inner?.properties?.link as { $ref?: string }).$ref, "#/definitions/A");
    });

    it("replaces self-reference in clone with $ref", () => {
        const def: Definition = { type: "object", properties: {} };
        (def.properties as Record<string, unknown>).self = def;

        const definitions: Record<string, Definition> = { Self: def };
        const { objToName, arrayToName } = buildNameMaps(definitions);

        const clone = deepCloneDefinition(def, objToName, arrayToName);

        assert.doesNotThrow(() => JSON.stringify(clone));
        const selfRef = (clone as { properties?: Record<string, unknown> }).properties?.self as { $ref?: string };
        assert.strictEqual(selfRef?.$ref, "#/definitions/Self");
    });
});
