import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("type-conditional-exclude-narrowing", assertValidSchema("type-conditional-exclude-narrowing", "MyObject"));