import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("annotation-readOnly", assertValidSchema("annotation-readOnly", "MyObject", { jsDoc: "basic" }));
