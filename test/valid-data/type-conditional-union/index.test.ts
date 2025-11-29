import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("type-conditional-union", assertValidSchema("type-conditional-union", "MyObject"));