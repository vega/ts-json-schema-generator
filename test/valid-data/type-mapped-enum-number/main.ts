enum Test {
    A,
    B,
    C,
}

export type MyObject = {
    [P in Test]: string;
};
