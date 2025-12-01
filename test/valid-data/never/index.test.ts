import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - never", assertValidSchema("never", "BasicNever"));
