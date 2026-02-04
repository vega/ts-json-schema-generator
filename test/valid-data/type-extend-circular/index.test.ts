import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - type-extend-circular", assertValidSchema("type-extend-circular", "MyType"));
