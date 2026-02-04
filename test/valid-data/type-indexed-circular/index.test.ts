import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - type-indexed-circular", assertValidSchema("type-indexed-circular", "MyType"));
