import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - enums-number", assertValidSchema("enums-number", "Enum"));
