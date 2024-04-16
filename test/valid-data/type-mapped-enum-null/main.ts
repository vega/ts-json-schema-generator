enum Test {
    A = null,
}

export type MyObject = {
    [P in Test]?: string;
};
