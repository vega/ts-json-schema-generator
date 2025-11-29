import { assertValidSchema } from "../../utils";
import { test } from 'node:test';

test("type-aliases-mixed", assertValidSchema("type-aliases-mixed", "MyObject"));