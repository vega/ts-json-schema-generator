export type ExposeOption = "all" | "none" | "export";
export type JSDocOption = "none" | "extended" | "basic";

export interface Config {
    path?: string;
    type?: string;
    tsconfig?: string;
    expose?: ExposeOption;
    topRef?: boolean;
    jsDoc?: JSDocOption;
    sortProps?: boolean;
    strictTuples?: boolean;
    skipTypeCheck?: boolean;
    encodeRefs?: boolean;
    extraTags?: string[];
}

export const DEFAULT_CONFIG = {
    expose: "export" as ExposeOption,
    topRef: true,
    jsDoc: "extended" as JSDocOption,
    sortProps: true,
    strictTuples: false,
    skipTypeCheck: false,
    encodeRefs: true,
    extraTags: [],
};
