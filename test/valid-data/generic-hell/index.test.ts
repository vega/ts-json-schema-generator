import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("generic-hell", assertValidSchema("generic-hell", "MyObject"));