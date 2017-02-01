type MyType1 = string | number;
type MyType2 = string | number[];
type MyType3 = (string | number)[];

type MyType4 = "s" | 1;
type MyType5 = "s" | (1)[];
type MyType6 = ("s" | 1)[];

export interface TypeUnion {
    var1: MyType1;
    var2: MyType2;
    var3: MyType3;

    var4: MyType4;
    var5: MyType5;
    var6: MyType6;
}
