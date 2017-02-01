interface MyPrivate {
    subfieldA: number;
    subfieldB: (string | number);
    subfieldC: {
        subsubfieldA: number[];
    };
}

export interface MyObject {
    field: MyPrivate;
}
