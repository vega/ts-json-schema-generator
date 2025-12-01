import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("type-mapped-exported-aliases", assertValidSchema("type-mapped-exported-aliases", "*"));
