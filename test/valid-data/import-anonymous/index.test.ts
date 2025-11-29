import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("import-anonymous", assertValidSchema("import-anonymous", "MyObject"));