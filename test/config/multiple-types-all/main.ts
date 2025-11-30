type NonExportedType = {
    misc: number;
};

export type ExportedType = {
    val: string;
    val2: NonExportedType;
};

export interface ExportedInterface {
    val: string;
}

export type Object1Prop = {
    name: string;
};

export type Object2Prop = {
    description: string;
};

export type MyObject1 = {
    id: number;
    bar: Object1Prop;
};

export type MyObject2 = {
    idStr: string;
    baz: Object2Prop;
};
