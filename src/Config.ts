export interface Config {
    path?: string;
    type?: string;
    minify?: boolean;
    schemaId?: string;
    tsconfig?: string;
    expose?: "all" | "none" | "export";
    topRef?: boolean;
    jsDoc?: "none" | "extended" | "basic";
    sortProps?: boolean;
    strictTuples?: boolean;
    skipTypeCheck?: boolean;
    encodeRefs?: boolean;
    extraTags?: string[];
    additionalProperties?: boolean;
}

export const DEFAULT_CONFIG: Omit<Required<Config>, "path" | "type" | "schemaId" | "tsconfig"> = {
    expose: "export",
    topRef: true,
    jsDoc: "extended",
    sortProps: true,
    strictTuples: false,
    skipTypeCheck: false,
    encodeRefs: true,
    minify: false,
    extraTags: [],
    additionalProperties: false,
};
