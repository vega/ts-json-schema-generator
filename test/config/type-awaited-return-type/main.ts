import type {
    returnsArray,
    returnsInferred,
    returnsNestedRef,
    returnsPrimitive,
    returnsUnion,
    returnsUnresolvable,
} from "./source.js";

export type MyArrayType = Awaited<ReturnType<typeof returnsArray>>;
export type MyInferredType = Awaited<ReturnType<typeof returnsInferred>>;
export type MyNestedRefType = Awaited<ReturnType<typeof returnsNestedRef>>;
export type MyPrimitiveType = Awaited<ReturnType<typeof returnsPrimitive>>;
export type MyUnionType = Awaited<ReturnType<typeof returnsUnion>>;
export type MyUnresolvableType = Awaited<ReturnType<typeof returnsUnresolvable>>;
