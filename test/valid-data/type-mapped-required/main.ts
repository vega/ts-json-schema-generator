interface WithOptional {
    foo?: number;
    bar?: string;
}

export type MyObject = Required<WithOptional>;
