import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - type-aliases-primitive", assertValidSchema("type-aliases-primitive", "MyString"));
