import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("const-spread", assertValidSchema("const-spread", "MyType"));
