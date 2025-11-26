export type A = {
    type: "A";
    a: string;
};

export type B = {
    type: "A";
    b: string;
};

/**
 * @discriminator type
 */
export type MyType = A | B;
