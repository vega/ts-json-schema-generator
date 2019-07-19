export interface PartialConfig {

    expose: "all" | "none" | "export";
    topRef: boolean;
    jsDoc: "none" | "extended" | "basic";
    sortProps?: boolean;
    strictTuples?: boolean;
    skipTypeCheck?: boolean;
    extraJsonTags?: string[];
}

interface NormalConfig extends PartialConfig {
    path: string;
    type?: string;
}

interface TSConfig extends PartialConfig {
    tsconfig: string;
    path: undefined;
    type?: string;
}

export type Config = NormalConfig | TSConfig;

export const DEFAULT_CONFIG: PartialConfig = {
    expose: "export",
    topRef: true,
    jsDoc: "extended",
    sortProps: true,
    strictTuples: false,
    skipTypeCheck: false,
    extraJsonTags: [],
};
