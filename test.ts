export type MyType = {
    /**
     * Where is this comment?
     */
    foo?: number;
} & {
    /**
     * Where is this comment?
     */
    bar?: MyType;
};
