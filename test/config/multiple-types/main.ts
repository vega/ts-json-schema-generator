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

// Exported, so we include it as a root node
export type Object1Prop = {
    name: string;
};

type Object2Prop = {
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
