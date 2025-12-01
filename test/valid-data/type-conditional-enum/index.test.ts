import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("type-conditional-enum", assertValidSchema("type-conditional-enum", "IParameter"));
