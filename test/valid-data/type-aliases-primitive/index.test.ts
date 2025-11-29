import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("type-aliases-primitive", assertValidSchema("type-aliases-primitive", "MyString"));
