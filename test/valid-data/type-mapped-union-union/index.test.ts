import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("type-mapped-union-union", assertValidSchema("type-mapped-union-union", "MyType"));