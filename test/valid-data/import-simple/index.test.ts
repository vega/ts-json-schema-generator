import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("import-simple", assertValidSchema("import-simple", "MyObject"));