import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - type-utility-return-type", assertValidSchema("type-utility-return-type", "MyReturnType"));
