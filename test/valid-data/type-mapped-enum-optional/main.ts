enum Test {
    A = 'a',
    B = 'b',
    C = 'c',
}

export type MyObject = {
    [P in Test]?: string;
};
