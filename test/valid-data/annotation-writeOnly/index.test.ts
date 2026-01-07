import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - annotation-writeOnly", assertValidSchema("annotation-writeOnly", "MyObject", { jsDoc: "basic" }));
