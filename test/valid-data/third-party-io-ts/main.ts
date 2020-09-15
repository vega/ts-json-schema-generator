import * as t from "io-ts";
const MyObjectCodec = t.intersection([
    t.type({
        type: t.literal("some-type"),
        foo: t.string,
        union: t.union([t.string, t.number]),
    }),
    t.partial({
        bar: t.number,
        baz: t.type({
            inner: t.boolean,
        }),
    }),
]);

type MyObjectC = typeof MyObjectCodec;

export type MyObject = t.TypeOf<MyObjectC>;
