import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - undefined-property", assertValidSchema("undefined-property", "MyType"));
