import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("type-intersection-partial-conflict-union", assertValidSchema("type-intersection-partial-conflict-union", "MyType"));