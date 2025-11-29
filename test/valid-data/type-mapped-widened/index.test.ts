import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("type-mapped-widened", assertValidSchema("type-mapped-widened", "MyObject"));