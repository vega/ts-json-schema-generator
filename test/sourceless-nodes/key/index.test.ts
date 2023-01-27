import path from "path";
import ts from "typescript";
import { createParser } from "../../../factory";
import { Context } from "../../../src/NodeParser";
import { DefinitionType } from "../../../src/Type/DefinitionType";
import { ObjectType } from "../../../src/Type/ObjectType";

const SOURCE = path.resolve(__dirname, "./source.ts");

describe("multiple sourceless nodes shouldn't conflict", () => {
    it("ensure all sourceless nodes have different ids", () => {
        const program = ts.createProgram([SOURCE], {});
        const parser = createParser(program, {});

        // Finds the Typescript function declaration node
        const source = program.getSourceFile(SOURCE);
        const fn = source!.statements[2] as ts.FunctionDeclaration;

        // Creates a sourceless type by inferring the function return type.
        const inferredReturnType = getReturnType(fn, program.getTypeChecker());

        // Checks that the inferred return type does not have any real source file.
        expect(inferredReturnType.getSourceFile()).toBeUndefined();

        const createdType = parser.createType(inferredReturnType, new Context(inferredReturnType)) as DefinitionType;

        expect(createdType).toBeInstanceOf(DefinitionType);

        const returnType = createdType.getType() as ObjectType;

        expect(returnType).toBeInstanceOf(ObjectType);

        const ids = [returnType.getId()];

        for (const property of returnType.getProperties()) {
            ids.push(property.getType().getId());
        }

        // Ensures all generated ids are unique
        expect(ids).toStrictEqual(Array(...new Set(ids)));
    });
});

// github.com/kitajs/kitajs/blob/1d1ae58c96c9a35cc426206f4fb19344be1cd3aa/packages/generator/src/util/node.ts#L44
function getReturnType(node: ts.SignatureDeclaration, typeChecker: ts.TypeChecker) {
    const signature = typeChecker.getSignatureFromDeclaration(node);
    const implicitType = typeChecker.getReturnTypeOfSignature(signature!);

    return typeChecker.typeToTypeNode(implicitType, undefined, ts.NodeBuilderFlags.NoTruncation) as ts.TypeNode;
}
