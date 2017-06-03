import * as ts from "typescript";

import { Config } from "../src/Config";
import { NodeParser } from "../src/NodeParser";
import { SchemaGenerator } from "../src/SchemaGenerator";
import { TypeFormatter } from "../src/TypeFormatter";

import { createFormatter } from "./formatter";
import { createParser } from "./parser";
import { createProgram } from "./program";

export function createGenerator(config: Config): SchemaGenerator {
    const program: ts.Program = createProgram(config);
    const parser: NodeParser = createParser(program, config);
    const formatter: TypeFormatter = createFormatter(config);

    return new SchemaGenerator(program, parser, formatter);
}
