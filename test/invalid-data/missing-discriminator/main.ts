export interface A {
    type: string;
}

export interface B {}

/**
 * @discriminator type
 */
export type MyType = A | B;
