import { Definition } from "../../src/Schema/Definition";
import { removeUnreachable } from "../../src/Utils/removeUnreachable";
import { StringMap } from "../../src/Utils/StringMap";

type DefinitionGenerator = (makeRef: (reffedDefinition?: Definition) => Definition) => Definition;
function packDefinition(defGen: DefinitionGenerator): [root: Definition, definitions: StringMap<Definition>] {
    const definitions: StringMap<Definition> = {};
    let refIdx = 0;
    function makeRefFunc(reffedDefinition: Definition = {}): Definition {
        const defName = `packedDef${refIdx++}`;
        definitions[defName] = reffedDefinition;
        return { $ref: `#/definitions/${defName}` };
    }
    const root = defGen(makeRefFunc);
    return [root, definitions];
}

function assertReachableDefinitions(defGen: DefinitionGenerator) {
    return (): void => {
        const [rootTypeDefinition, definitions] = packDefinition(defGen);
        let prunedDefinitions = removeUnreachable(rootTypeDefinition, definitions);
        expect(prunedDefinitions).toEqual(definitions);

        definitions["extraDef"] = {};
        prunedDefinitions = removeUnreachable(rootTypeDefinition, definitions);
        expect(prunedDefinitions).not.toEqual(definitions);
    };
}

describe("removeUnreachable", () => {
    it(
        "preserves reachability for a packed definition",
        assertReachableDefinitions((makeRef) => ({
            type: ["array", "boolean", "integer", "null", "number", "object", "string"],
            allOf: [makeRef(), makeRef()],
            anyOf: [makeRef(), makeRef()],
            oneOf: [makeRef(), makeRef()],
            contains: makeRef(),
            not: makeRef(),
            if: makeRef(),
            then: makeRef(),
            else: makeRef(),
            properties: { foo: makeRef(), bar: makeRef(), $ref: makeRef() },
            patternProperties: { "^foo$": makeRef(), "b.a.r": makeRef(), $ref: makeRef() },
            additionalProperties: makeRef(),
            items: [makeRef(), makeRef()],
            additionalItems: makeRef(),
        }))
    );

    it(
        "preserves reachability for homogenous arrays",
        assertReachableDefinitions((makeRef) => ({ type: "array", items: makeRef() }))
    );

    it(
        "preserves reachability for indirect refs",
        assertReachableDefinitions((makeRef) => ({ not: makeRef({ not: makeRef() }) }))
    );
});
