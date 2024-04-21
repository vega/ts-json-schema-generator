type MyType1 = "s1";
type MyType2 = MyType1 | "s2" | "s3";
type MyType3 = MyType2 | "s4" | "s5";
type MyType10 = MyType3 | MyType2 | "s6";

export type MyType = Record<MyType10, string>;
