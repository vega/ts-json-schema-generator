import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("enums-mixed", assertValidSchema("enums-mixed", "Enum"));
