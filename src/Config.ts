export interface Config {
    path: string;
    type: string;

    expose: "all" | "none" | "export";
    topRef: boolean;
    jsDoc: "none" | "extended" | "default";
}
