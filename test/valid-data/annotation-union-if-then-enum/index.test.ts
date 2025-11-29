import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("annotation-union-if-then-enum", assertValidSchema("annotation-union-if-then-enum", "AB", { jsDoc: "basic" }));
