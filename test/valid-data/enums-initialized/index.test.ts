import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("enums-initialized", assertValidSchema("enums-initialized", "Enum"));
