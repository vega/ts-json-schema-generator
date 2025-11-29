import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("type-mapped-double-exclude", assertValidSchema("type-mapped-double-exclude", "MyObject"));