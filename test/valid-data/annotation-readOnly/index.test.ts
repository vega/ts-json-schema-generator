import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - annotation-readOnly", assertValidSchema("annotation-readOnly", "MyObject", { jsDoc: "basic" }));
