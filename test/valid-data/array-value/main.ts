export type BasicObj = {
    name: string;
    age: number;
};

export type MyType = {
    strToNumberArr: Record<string, number[]>;
    numToNumberArr: Record<string, number[]>;
    numToObjArr: Record<string, BasicObj[]>;
};
