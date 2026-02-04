import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - undefined-union", assertValidSchema("undefined-union", "MyType"));
