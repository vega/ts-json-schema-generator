import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - literal-array-type", assertValidSchema("literal-array-type", "MyType"));
