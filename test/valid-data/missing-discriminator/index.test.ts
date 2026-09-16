import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - missing-discriminator", assertValidSchema("missing-discriminator", "MyType"));
