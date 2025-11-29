import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("enums-union", assertValidSchema("enums-union", "MyObject"));