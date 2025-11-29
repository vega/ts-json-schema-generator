import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("type-aliases-recursive-export", assertValidSchema("type-aliases-recursive-export", "MyObject"));