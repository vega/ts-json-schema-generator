export interface PartialConfig {
    expose: "all" | "none" | "export";
    topRef: boolean;
    jsDoc: "none" | "extended" | "basic";
}
export interface Config extends PartialConfig {
    path: string;
    type: string;
}
export declare const DEFAULT_CONFIG: PartialConfig;
