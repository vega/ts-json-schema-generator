export interface PartialConfig {

    expose: "all" | "none" | "export";
    topRef: boolean;
    jsDoc: "none" | "extended" | "basic";
    sortProps?: boolean;
    strictTuples?: boolean;
    skipTypeCheck?: boolean;
    files?: string;
}

export interface Config extends PartialConfig {
    path: string;
    type: string;
}

export const DEFAULT_CONFIG: PartialConfig = {
    expose: "export",
    topRef: true,
    jsDoc: "extended",
    sortProps: true,
    strictTuples: false,
    skipTypeCheck: false,
};
