import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("annotation-union-if-then", assertValidSchema("annotation-union-if-then", "Animal", { jsDoc: "basic" }));
