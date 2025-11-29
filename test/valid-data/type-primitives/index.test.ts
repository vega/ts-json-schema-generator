import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("type-primitives", assertValidSchema("type-primitives", "MyObject"));