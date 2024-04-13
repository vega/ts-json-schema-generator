import { Config, DEFAULT_CONFIG } from "../src/Config";
import { SchemaGenerator } from "../src/SchemaGenerator";
import { createFormatter } from "./formatter";
import { createParser } from "./parser";
import { createProgram } from "./program";

export function createGenerator(config: Config): SchemaGenerator {
    const completedConfig = { ...DEFAULT_CONFIG, ...config };
    const program = createProgram(completedConfig);
    const parser = createParser(program, completedConfig);
    const formatter = createFormatter(completedConfig);

    return new SchemaGenerator(program, parser, formatter, completedConfig);
}
