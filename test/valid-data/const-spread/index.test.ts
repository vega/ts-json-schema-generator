import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - const-spread", assertValidSchema("const-spread", "MyType"));
