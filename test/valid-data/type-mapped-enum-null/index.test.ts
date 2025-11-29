import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("type-mapped-enum-null", assertValidSchema("type-mapped-enum-null", "MyObject"));