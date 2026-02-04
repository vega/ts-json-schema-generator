import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - ignore-export", assertValidSchema("ignore-export", "*"));
