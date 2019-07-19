interface Test {
    a: string;
    b: number;
    c: boolean;
    d: string[];
}

export type MyObject = Omit<Test, "b" | "d">;
