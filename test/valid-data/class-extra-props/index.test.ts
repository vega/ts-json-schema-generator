import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - class-extra-props", assertValidSchema("class-extra-props", "MyObject"));
