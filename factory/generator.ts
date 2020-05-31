import { Config } from "../src/Config";
import { SchemaGenerator } from "../src/SchemaGenerator";
import { createFormatter } from "./formatter";
import { createParser } from "./parser";
import { createProgram } from "./program";

export function createGenerator(config: Config): SchemaGenerator {
    const program = createProgram(config);
    const parser = createParser(program, config);
    const formatter = createFormatter(config);

    return new SchemaGenerator(program, parser, formatter, config);
}
