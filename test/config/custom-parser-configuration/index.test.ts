import { it } from "node:test";
import ts from "typescript";
import type { BaseType, Context, ReferenceType, SubNodeParser } from "../../../index";
import { StringType } from "../../../src/Type/StringType";
import { assertConfigSchema } from "../../utils";

class ExampleConstructorParser implements SubNodeParser {
    supportsNode(node: ts.Node): boolean {
        return node.kind === ts.SyntaxKind.ConstructorType;
    }
    createType(node: ts.Node, context: Context, reference?: ReferenceType): BaseType {
        return new StringType();
    }
}

it(
    "config - custom-parser-configuration",
    assertConfigSchema(
        "custom-parser-configuration",
        {
            type: "MyObject",
        },
        false,
        undefined,
        (parser) => parser.addNodeParser(new ExampleConstructorParser()),
    ),
);
