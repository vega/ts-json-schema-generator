import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - type-indexed-circular-access", assertValidSchema("type-indexed-circular-access", "*"));
