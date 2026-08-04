import * as zod from "zod";

// Regression test for resolving types derived via zod's `z.infer<typeof schema>`.
// The schema builder's return type is built from deep generics that the generator
// cannot re-derive by statically re-parsing the AST. The type checker, however,
// resolves `z.infer<...>` to a concrete type, which the generator now falls back to.
// See https://github.com/vega/ts-json-schema-generator/issues/758

const NumberSchema = zod.number();
type NumberType = zod.infer<typeof NumberSchema>;

const ObjectSchema = zod.object({
    name: zod.string(),
    age: zod.number().optional(),
    role: zod.enum(["admin", "user"]),
});

const UnionSchema = zod.discriminatedUnion("kind", [
    zod.object({ kind: zod.literal("a"), value: zod.string() }),
    zod.object({ kind: zod.literal("b"), count: zod.number() }),
]);

export interface MyObject {
    numberField: NumberType;
    objectField: zod.infer<typeof ObjectSchema>;
    unionField: zod.infer<typeof UnionSchema>;
}
