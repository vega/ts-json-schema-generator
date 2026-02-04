import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - never-record", assertValidSchema("never-record", "Mapped"));
