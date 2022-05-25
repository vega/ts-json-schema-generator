type Alpha = { stringProp: string; betaStringProp: Beta['stringProp']; }
type TypedAlphaWithDefault<T = number> = { tProp: T; betaStringProp: Beta['stringProp']; }
type TypedAlphaWithoutDefault<T, E> = { tProp: T; eProp: E; betaStringProp: Beta['stringProp']; }

export type Beta = {
    stringProp: string;
    alphaStringProp: Alpha['stringProp'];
    alphaNumberDefaultProp: TypedAlphaWithDefault["tProp"]
    alphaNumberWithoutDefaultProp: TypedAlphaWithoutDefault<number, string>["tProp"]
    alphaUnionProp: TypedAlphaWithoutDefault<number | null, string>["tProp" | "eProp"]
    alphaKeyofProp: TypedAlphaWithoutDefault<number | null, string>[keyof TypedAlphaWithoutDefault<number | null, string>]
}
