import type ts from "typescript";
export interface Config {
    /**
     * Glob pattern(s) for source TypeScript files to process.
     * If not provided, falls back to files from tsconfig.
     */
    path?: string;
    /**
     * Name of the type(s)/interface(s) to generate schema for.
     * Use "*" to generate schemas for all exported types.
     */
    type?: string | string[];
    /**
     * Minify the output JSON schema (no whitespace).
     * When false, the schema is pretty-printed with 2-space indentation.
     * @default false
     */
    minify?: boolean;
    /**
     * Sets the `$id` property in the root of the generated schema.
     * Used for schema identification and referencing.
     */
    schemaId?: string;
    /**
     * Path to a custom tsconfig.json file for TypeScript compilation.
     * If not provided, uses default TypeScript configuration.
     */
    tsconfig?: string;
    /**
     * Controls which types are exposed as definitions in the schema.
     * - "all": Exposes all types except type literals
     * - "none": Exposes no types automatically
     * - "export": Only exposes exported types (respects @internal JSDoc tag)
     * @default "export"
     */
    expose?: "all" | "none" | "export";
    /**
     * Wraps the root type in a `$ref` definition.
     * When false, inlines the root type definition directly.
     * @default true
     */
    topRef?: boolean;
    /**
     * Controls how JSDoc comments are parsed and included in the schema.
     * - "none": Ignores all JSDoc annotations
     * - "basic": Parses standard JSON Schema JSDoc tags
     * - "extended": Parses all tags plus descriptions, examples, and type overrides
     * @default "extended"
     */
    jsDoc?: "none" | "extended" | "basic";
    /**
     * Adds a `markdownDescription` field alongside `description` in the schema.
     * Preserves markdown formatting including newlines.
     * Only works with `jsDoc: "extended"`.
     * @default false
     */
    markdownDescription?: boolean;
    /**
     * Includes the complete raw JSDoc comment as `fullDescription` in the schema.
     * Only works with `jsDoc: "extended"`.
     * @default false
     */
    fullDescription?: boolean;
    /**
     * Sorts object properties alphabetically in the output.
     * @default true
     */
    sortProps?: boolean;
    /**
     * Controls whether tuples allow additional items beyond their defined length.
     * @default false
     */
    strictTuples?: boolean;
    /**
     * Skips TypeScript type checking to improve performance.
     * Speeds up generation but may miss type errors.
     * @default false
     */
    skipTypeCheck?: boolean;
    /**
     * URI-encodes `$ref` values (e.g., `#/definitions/Foo%3CBar%3E`).
     * When false, uses raw names in reference paths.
     * @default true
     */
    encodeRefs?: boolean;
    /**
     * Array of additional JSDoc tag names to include in the schema.
     * Custom tags (e.g., `@customProperty`) are parsed and included in output.
     * Values are parsed as JSON5.
     * @default []
     */
    extraTags?: string[];
    /**
     * Sets default value for `additionalProperties` on objects without index signatures.
     * When false, objects get `additionalProperties: false` by default.
     * When true, allows additional properties on all objects.
     * @default false
     */
    additionalProperties?: boolean;
    /**
     * Controls discriminator style for discriminated unions.
     * - "json-schema": Uses `if`/`then`/`allOf` with properties containing discriminator enum
     * - "open-api": Uses OpenAPI 3.x style with `discriminator: { propertyName }` and `oneOf`
     * @default "json-schema"
     */
    discriminatorType?: "json-schema" | "open-api";
    /**
     * Controls how function types are handled in the schema.
     * - "fail": Throws error when encountering function types
     * - "comment": Generates schema with `$comment` describing the function signature
     * - "hide": Treats functions as NeverType (excluded from schema)
     * @default "comment"
     */
    functions?: FunctionOptions;
    /**
     * Pre-compiled TypeScript Program instance to use.
     * Bypasses the default setup of a TypeScript program, and so some configuration options may not be applied.
     * Useful for programmatic usage with existing TypeScript compilation, or for vfs scenarios where you do not want file-system representation.
     */
    tsProgram?: ts.Program;
}
export type CompletedConfig = Config & typeof DEFAULT_CONFIG;
export type FunctionOptions = "fail" | "comment" | "hide";
export declare const DEFAULT_CONFIG: Omit<Required<Config>, "path" | "type" | "schemaId" | "tsconfig" | "tsProgram">;
