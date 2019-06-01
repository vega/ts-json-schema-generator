export type Primitives = string | number | boolean;

export type MyObject = {
    primitives: Primitives;
    noNumber: Exclude<Primitives, number>;
    noNumberAndBoolean: Exclude<Primitives, number | boolean>;
    noStringAndNumber: Exclude<Exclude<Primitives, number>, string>;
};
