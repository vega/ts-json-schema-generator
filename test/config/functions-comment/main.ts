type MyConstructor = new () => any;

export type MyType = {
    foo?: (b: string) => number;
    bar?: number;
    baz?: MyConstructor;
};
