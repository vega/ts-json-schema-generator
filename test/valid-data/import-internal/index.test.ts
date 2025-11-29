import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("import-internal", assertValidSchema("import-internal", "MyObject", {"jsDoc":"basic"}));