import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("type-aliases-anonymous", assertValidSchema("type-aliases-anonymous", "MyObject"));