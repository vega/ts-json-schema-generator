import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("string-literals-null", assertValidSchema("string-literals-null", "MyObject"));