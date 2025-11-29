import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("type-mapped-union-intersection", assertValidSchema("type-mapped-union-intersection", "MyObject"));