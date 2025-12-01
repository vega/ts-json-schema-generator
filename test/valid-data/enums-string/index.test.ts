import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - enums-string", assertValidSchema("enums-string", "Enum"));
