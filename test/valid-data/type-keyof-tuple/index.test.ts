import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - type-keyof-tuple", assertValidSchema("type-keyof-tuple", "MyType"));
