import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("generic-recursive", assertValidSchema("generic-recursive", "MyObject"));