import * as ts from "typescript";

import { NodeParser } from "../src/NodeParser";
import { TypeFormatter } from "../src/TypeFormatter";
import { SchemaGenerator } from "../src/SchemaGenerator";

import { createProgram } from "./program";
import { createParser } from "./parser";
import { createFormatter } from "./formatter";

export function createGenerator(path: string): SchemaGenerator {
    const program: ts.Program = createProgram(path);
    const parser: NodeParser = createParser(program);
    const formatter: TypeFormatter = createFormatter();

    return new SchemaGenerator(program, parser, formatter);
}
