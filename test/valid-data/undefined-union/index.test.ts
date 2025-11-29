import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("undefined-union", assertValidSchema("undefined-union", "MyType"));
