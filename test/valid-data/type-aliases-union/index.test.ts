import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("type-aliases-union", assertValidSchema("type-aliases-union", "MyUnion"));