import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - undefined-alias", assertValidSchema("undefined-alias", "MyType"));
