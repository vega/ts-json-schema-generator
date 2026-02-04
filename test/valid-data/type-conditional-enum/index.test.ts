import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - type-conditional-enum", assertValidSchema("type-conditional-enum", "IParameter"));
