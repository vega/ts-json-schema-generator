interface Types1 {
    String: string;
}

interface Types2 {
    String: string;
    Number: number;
}

export interface MyType {
    types1: Types1[keyof Types1];
    types2: Types2[keyof Types2];
}
