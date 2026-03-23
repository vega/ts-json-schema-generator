type UrlTypes = {
    /**
     * @pattern ^https:\/\/.*$
     */
    url: string;
};

interface AllFields {
    field1: string;
    field2: string;
}

type UrlFields = {
    [key in keyof AllFields]?: UrlTypes["url"];
};

export interface Test {
    foo?: UrlFields;
}
