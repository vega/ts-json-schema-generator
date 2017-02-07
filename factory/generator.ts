import * as ts from "typescript";

import { Config } from "../src/Config";
import { NodeParser } from "../src/NodeParser";
import { TypeFormatter } from "../src/TypeFormatter";
import { SchemaGenerator } from "../src/SchemaGenerator";

import { createProgram } from "./program";
import { createParser } from "./parser";
import { createFormatter } from "./formatter";

export function createGenerator(config: Config): SchemaGenerator {
    const program: ts.Program = createProgram(config);
    const parser: NodeParser = createParser(program, config);
    const formatter: TypeFormatter = createFormatter(config);

    return new SchemaGenerator(program, parser, formatter);
}
