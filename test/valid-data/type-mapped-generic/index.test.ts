import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("type-mapped-generic", assertValidSchema("type-mapped-generic", "MyObject"));