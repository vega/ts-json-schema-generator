export interface MyObject {
    field: {
        subfieldA: number;
        subfieldB: (string | number);
        subfieldC: {
            subsubfieldA: number[];
        };
    };
}
