import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("keyof-typeof-enum", assertValidSchema("keyof-typeof-enum", "MyObject"));
