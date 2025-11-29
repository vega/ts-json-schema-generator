import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("type-conditional-inheritance", assertValidSchema("type-conditional-inheritance", "MyObject"));