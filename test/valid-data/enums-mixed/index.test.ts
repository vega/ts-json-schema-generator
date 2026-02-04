import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - enums-mixed", assertValidSchema("enums-mixed", "Enum"));
