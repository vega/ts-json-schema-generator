import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - type-mapped-additional-props", assertValidSchema("type-mapped-additional-props", "MyObject"));
