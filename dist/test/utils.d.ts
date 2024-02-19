import { Options as AjvOptions } from "ajv";
import { Config } from "../src/Config";
import { SchemaGenerator } from "../src/SchemaGenerator";
import { BaseType } from "../src/Type/BaseType";
export declare function createGenerator(config: Config): SchemaGenerator;
export declare function assertValidSchema(relativePath: string, type?: Config["type"], config_?: Omit<Config, "type">, options?: {
    validSamples?: any[];
    invalidSamples?: any[];
    ajvOptions?: AjvOptions;
}): () => void;
export declare function assertMissingFormatterFor(missingType: BaseType, relativePath: string, type?: string): () => void;
