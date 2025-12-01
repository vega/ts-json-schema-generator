import { MyType } from "./types";

type StringLiteral = "two";
type Empty = ``;
type NoSubstitution = `one_two_three`;
type Interpolation = `one_${StringLiteral}_three`;
type Union = "one" | StringLiteral | `three`;
type NestedUnion = `_${Union}_`;
type Number = `${number}%`;
type Boolean = `${boolean}!`;
type Any = `one_${any}_three`;
type Definiiton = `${MyType}`;
type Generic<T extends string> = `${T}`;
type Intrinsic<T extends string> = `${Capitalize<T>}`;

export interface MyObject {
    empty: Empty;
    noSubstitution: NoSubstitution;
    interpolation: Interpolation;
    union: Union;
    nestedUnion: NestedUnion;
    number: Number;
    boolean: Boolean;
    any: Any;
    definition: Definiiton;
    generic: Generic<"foo">;
    intrinsic: Intrinsic<"foo">;
}
