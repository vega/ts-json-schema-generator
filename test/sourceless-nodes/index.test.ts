import { describe, it, expect } from "vitest";
import path from "path";
import ts from "typescript";
import { createParser } from "../../factory";
import { Context } from "../../src/NodeParser.js";
import { LiteralType } from "../../src/Type/LiteralType.js";
import { NumberType } from "../../src/Type/NumberType.js";
import { ObjectType } from "../../src/Type/ObjectType.js";
import { DEFAULT_CONFIG } from "../../src/Config.js";

const SOURCE = path.resolve(__dirname, "./source.ts");

describe("sourceless-nodes", () => {
    it("tests creating json schemas with ts.Nodes without valid source files", () => {
        const program = ts.createProgram([SOURCE], {});
        const parser = createParser(program, DEFAULT_CONFIG);

        // Finds the Typescript function declaration node
        const source = program.getSourceFile(SOURCE);
        const fn = source!.statements[0] as ts.FunctionDeclaration;

        // Creates a sourceless type by inferring the function return type.
        const inferredReturnType = getReturnType(fn, program.getTypeChecker());

        // Checks that the inferred return type does not have any real source file.
        expect(inferredReturnType.getSourceFile()).toBeUndefined();

        // Generates the json schema of this inferred return type
        const baseType = parser.createType(inferredReturnType, new Context(inferredReturnType));

        const objectType = (baseType as any).type as ObjectType;
        expect(objectType).toBeDefined();
        expect(objectType).toBeInstanceOf(ObjectType);

        const [propA, propB] = objectType.getProperties();

        expect(propA.getName()).toBe("a");
        expect(propA.getType()).toBeInstanceOf(NumberType);

        expect(propB.getName()).toBe("b");
        expect(propB.getType()).toBeInstanceOf(LiteralType);
    });
});

// From https://github.com/kitajs/kitajs/blob/ebf23297de07887c78becff52120f941e69386ec/packages/parser/src/util/nodes.ts#L64
function getReturnType(node: ts.SignatureDeclaration, typeChecker: ts.TypeChecker) {
    const signature = typeChecker.getSignatureFromDeclaration(node);
    const implicitType = typeChecker.getReturnTypeOfSignature(signature!);

    return typeChecker.typeToTypeNode(implicitType, undefined, ts.NodeBuilderFlags.NoTruncation) as ts.TypeNode;
}
