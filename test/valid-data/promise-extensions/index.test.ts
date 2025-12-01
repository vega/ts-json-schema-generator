import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - promise-extensions", assertValidSchema("promise-extensions", "*"));
