import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - type-date-annotation", assertValidSchema("type-date-annotation", "MyObject", { jsDoc: "basic" }));
