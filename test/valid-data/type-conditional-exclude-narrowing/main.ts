export type Align = "left" | "right" | "center";

export type Text = {
    align?: Align | number;
};

type OmitPropertyType<T, U> = {
    [P in keyof T]: Exclude<T[P], U>;
};

export type GoodPrimitives = string | number;
export type BadPrimitives = null | boolean;
export type Primitives = GoodPrimitives | BadPrimitives;

export interface MyObject {
    textWithoutAlign: OmitPropertyType<Text, Align>;
    textWithoutNumbers: OmitPropertyType<Text, number>;
    allPrims: Exclude<Primitives, Text>;
    goodPrims: Exclude<Primitives, boolean | null>;
    badPrims: Exclude<Exclude<Primitives, string>, number>;
    stringOrNull: Exclude<Primitives, number | boolean>;
}
