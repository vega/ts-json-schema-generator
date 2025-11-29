import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("type-conditional-narrowing", assertValidSchema("type-conditional-narrowing", "MyObject"));