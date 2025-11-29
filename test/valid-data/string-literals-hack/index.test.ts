import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("string-literals-hack", assertValidSchema("string-literals-hack", "MyObject"));