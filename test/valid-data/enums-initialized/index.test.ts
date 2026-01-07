import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - enums-initialized", assertValidSchema("enums-initialized", "Enum"));
