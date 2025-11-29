import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("generic-prefixed-number", assertValidSchema("generic-prefixed-number", "MyObject"));