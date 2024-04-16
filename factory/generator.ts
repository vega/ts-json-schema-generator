import { Config, DEFAULT_CONFIG } from "../src/Config.js";
import { SchemaGenerator } from "../src/SchemaGenerator.js";
import { createFormatter } from "./formatter.js";
import { createParser } from "./parser.js";
import { createProgram } from "./program.js";

export function createGenerator(config: Config): SchemaGenerator {
    const completedConfig = { ...DEFAULT_CONFIG, ...config };
    const program = createProgram(completedConfig);
    const parser = createParser(program, completedConfig);
    const formatter = createFormatter(completedConfig);

    return new SchemaGenerator(program, parser, formatter, completedConfig);
}
