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
}
export declare const DEFAULT_CONFIG: Omit<Required<Config>, "path" | "type" | "schemaId" | "tsconfig">;
