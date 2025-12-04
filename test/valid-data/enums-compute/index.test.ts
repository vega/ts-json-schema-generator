import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - enums-compute", assertValidSchema("enums-compute", "Enum"));
