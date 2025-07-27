import { UnionTypeFormatter } from "../../src/TypeFormatter/UnionTypeFormatter.js";
import { UnionType } from "../../src/Type/UnionType.js";
import { ObjectType } from "../../src/Type/ObjectType.js";

describe("UnionTypeFormatter", () => {
    let formatter: UnionTypeFormatter;
    let mockChildFormatter: any;

    beforeEach(() => {
        mockChildFormatter = {
            getDefinition: jest.fn(),
            getChildren: jest.fn(() => []),
        };
        formatter = new UnionTypeFormatter(mockChildFormatter);
    });

    describe("supports method", () => {
        it("should return true for UnionType", () => {
            const unionType = new UnionType([]);
            expect(formatter.supportsType(unionType)).toBe(true);
        });

        it("should return false for non-UnionType", () => {
            const objectType = new ObjectType("Test", [], [], false);
            expect(formatter.supportsType(objectType)).toBe(false);
        });
    });
});