export interface Config {
    path?: string;
    type?: string;
    minify?: boolean;
    schemaId?: string;
    tsconfig?: string;
    expose?: "all" | "none" | "export";
    topRef?: boolean;
    jsDoc?: "none" | "extended" | "basic";
    markdownDescription?: boolean;
    sortProps?: boolean;
    strictTuples?: boolean;
    skipTypeCheck?: boolean;
    encodeRefs?: boolean;
    extraTags?: string[];
    additionalProperties?: boolean;
    discriminatorType?: "json-schema" | "open-api";
    functions?: FunctionOptions;
    constAsEnum?: boolean;
}

export type CompletedConfig = Config & typeof DEFAULT_CONFIG;

export type FunctionOptions = "fail" | "comment" | "hide";

export const DEFAULT_CONFIG: Omit<Required<Config>, "path" | "type" | "schemaId" | "tsconfig"> = {
    expose: "export",
    topRef: true,
    jsDoc: "extended",
    markdownDescription: false,
    sortProps: true,
    strictTuples: false,
    skipTypeCheck: false,
    encodeRefs: true,
    minify: false,
    extraTags: [],
    additionalProperties: false,
    discriminatorType: "json-schema",
    functions: "comment",
    constAsEnum: false
};