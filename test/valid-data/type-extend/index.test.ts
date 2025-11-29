import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("type-extend", assertValidSchema("type-extend", "MyObject"));